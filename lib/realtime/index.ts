/**
 * ScoutOS Queue Port Client
 * 
 * Replaces Redis Pub/Sub and SSE with ScoutOS Live's built-in queue port.
 * Perfect for real-time meeting updates.
 * 
 * Auth: APP_JWT is auto-injected at runtime - no setup needed.
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

// Queue API base URL (same origin, /_ports/queue)
const QUEUE_URL = "/_ports/queue";

// Get the auth token from environment (auto-injected by ScoutOS)
function getAuthHeaders(): HeadersInit {
  const token = process.env.APP_JWT;
  if (!token) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function isDevelopment(): boolean {
  return !process.env.APP_JWT || process.env.NODE_ENV === "development";
}

// In-memory adapter for development
class InMemoryAdapter implements RealtimePort {
  private channels = new Map<string, Set<(message: RealtimeMessage) => void>>();

  createChannel(name: string): RealtimeChannel {
    const channelName = `meeting:${name}`;
    
    return {
      subscribe: (callback) => {
        if (!this.channels.has(channelName)) {
          this.channels.set(channelName, new Set());
        }
        this.channels.get(channelName)!.add(callback);
        
        // Return unsubscribe function
        return () => {
          this.channels.get(channelName)?.delete(callback);
        };
      },
      publish: async (message) => {
        const subscribers = this.channels.get(channelName);
        if (subscribers) {
          subscribers.forEach((cb) => cb(message));
        }
      },
      unsubscribe: async () => {
        this.channels.delete(channelName);
      },
    };
  }

  isConnected(): boolean {
    return true;
  }
}

// ScoutOS Queue adapter for production
class ScoutOSQueueAdapter implements RealtimePort {
  private pollIntervals = new Map<string, NodeJS.Timeout>();
  private lastMessageIds = new Map<string, string>();

  createChannel(name: string): RealtimeChannel {
    const topic = `meeting:${name}`;
    let subscribers = new Set<(message: RealtimeMessage) => void>();

    return {
      subscribe: (callback) => {
        subscribers.add(callback);

        // Start polling for messages (SSE-like behavior)
        const poll = async () => {
          try {
            const response = await fetch(`${QUEUE_URL}/${topic}/messages`, {
              method: "GET",
              headers: getAuthHeaders(),
            });

            if (response.ok) {
              const messages = await response.json();
              for (const msg of messages || []) {
                // Deduplicate messages
                const lastId = this.lastMessageIds.get(topic);
                if (msg.id && msg.id !== lastId) {
                  this.lastMessageIds.set(topic, msg.id);
                  subscribers.forEach((cb) => cb(msg.payload || msg));
                }
              }
            }
          } catch (error) {
            console.error("Queue poll error:", error);
          }
        };

        // Poll every second
        const interval = setInterval(poll, 1000);
        this.pollIntervals.set(topic, interval);

        // Return unsubscribe function
        return () => {
          subscribers.delete(callback);
          if (subscribers.size === 0) {
            const int = this.pollIntervals.get(topic);
            if (int) clearInterval(int);
            this.pollIntervals.delete(topic);
          }
        };
      },

      publish: async (message) => {
        await fetch(`${QUEUE_URL}/${topic}`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ message }),
        });
      },

      unsubscribe: async () => {
        const interval = this.pollIntervals.get(topic);
        if (interval) clearInterval(interval);
        this.pollIntervals.delete(topic);
        this.lastMessageIds.delete(topic);
        subscribers.clear();
      },
    };
  }

  isConnected(): boolean {
    return true;
  }
}

// Factory to get the appropriate adapter
export function getRealtimeAdapter(): RealtimePort {
  if (isDevelopment()) {
    return new InMemoryAdapter();
  }
  
  return new ScoutOSQueueAdapter();
}

// Export singleton instance
let _instance: RealtimePort | null = null;

export function getRealtime(): RealtimePort {
  if (!_instance) {
    _instance = getRealtimeAdapter();
  }
  return _instance;
}

// Export for backward compatibility with SSE endpoint
export { ScoutOSQueueAdapter, InMemoryAdapter };