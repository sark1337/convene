/**
 * Ports & Adapters Pattern for Realtime
 * 
 * Port: Interface for realtime pub/sub operations
 * Adapter: Implementations for different backends
 */

// Types
export interface RealtimeMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface RealtimeChannel {
  subscribe(callback: (message: RealtimeMessage) => void): () => void;
  publish(message: RealtimeMessage): Promise<void>;
  unsubscribe(): Promise<void>;
}

export interface RealtimePort {
  createChannel(name: string): RealtimeChannel;
  isConnected(): boolean;
}

// In-memory adapter for development (no external dependencies)
class InMemoryAdapter implements RealtimePort {
  private channels = new Map<string, Set<(message: RealtimeMessage) => void>>();

  createChannel(name: string): RealtimeChannel {
    return {
      subscribe: (callback) => {
        if (!this.channels.has(name)) {
          this.channels.set(name, new Set());
        }
        this.channels.get(name)!.add(callback);
        return () => {
          this.channels.get(name)?.delete(callback);
        };
      },
      publish: async (message) => {
        const subscribers = this.channels.get(name);
        if (subscribers) {
          subscribers.forEach((cb) => cb(message));
        }
      },
      unsubscribe: async () => {
        this.channels.delete(name);
      },
    };
  }

  isConnected(): boolean {
    return true;
  }
}

// Redis Pub/Sub adapter for production
let RedisAdapter: typeof import("./adapters/redis-pubsub").RedisPubSubAdapter | null = null;

async function getRedisAdapter(): Promise<RealtimePort | null> {
  try {
    // Dynamic import to avoid build errors when Redis isn't configured
    const module = await import("./adapters/redis-pubsub");
    RedisAdapter = module.RedisPubSubAdapter;
    return new RedisAdapter();
  } catch {
    console.warn("Redis adapter not available, using in-memory fallback");
    return null;
  }
}

// Factory to get the appropriate adapter
export async function getRealtimeAdapter(): Promise<RealtimePort> {
  // Try Redis first (production)
  const redisAdapter = await getRedisAdapter();
  if (redisAdapter) {
    return redisAdapter;
  }
  
  // Fall back to in-memory (development)
  return new InMemoryAdapter();
}

// Export singleton instance
let _instance: RealtimePort | null = null;

export async function getRealtime(): Promise<RealtimePort> {
  if (!_instance) {
    _instance = await getRealtimeAdapter();
  }
  return _instance;
}