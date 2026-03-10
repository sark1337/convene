/**
 * ScoutOS Queue Port Client
 * 
 * Gracefully handles missing APP_JWT by using in-memory pub/sub.
 * Works in development, production, and ScoutOS environments.
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

// Queue API base URL
const QUEUE_URL = "/_ports/queue";

// Check if we can use ScoutOS queue (requires APP_JWT)
function canUseScoutOSQueue(): boolean {
  const token = process.env.APP_JWT;
  return !!token && token.length > 0 && token !== "your_scoutos_api_key";
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = process.env.APP_JWT;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// In-memory adapter (always works)
class InMemoryAdapter implements RealtimePort {
  private channels = new Map<string, Set<(message: RealtimeMessage) => void>>();

  createChannel(name: string): RealtimeChannel {
    const topic = `meeting:${name}`;
    
    return {
      subscribe: (callback) => {
        if (!this.channels.has(topic)) {
          this.channels.set(topic, new Set());
        }
        this.channels.get(topic)!.add(callback);
        
        return () => {
          this.channels.get(topic)?.delete(callback);
        };
      },
      publish: async (message) => {
        const subscribers = this.channels.get(topic);
        if (subscribers) {
          subscribers.forEach((cb) => cb(message));
        }
      },
      unsubscribe: async () => {
        this.channels.delete(topic);
      },
    };
  }

  isConnected(): boolean {
    return true;
  }
}

// ScoutOS Queue adapter (production)
class ScoutOSQueueAdapter implements RealtimePort {
  private pollIntervals = new Map<string, NodeJS.Timeout>();
  private lastMessageIds = new Map<string, string>();

  createChannel(name: string): RealtimeChannel {
    const topic = `meeting:${name}`;
    let subscribers = new Set<(message: RealtimeMessage) => void>();

    return {
      subscribe: (callback) => {
        subscribers.add(callback);

        // Poll for messages
        const poll = async () => {
          if (!canUseScoutOSQueue()) {
            // Fall back to in-memory behavior
            return;
          }

          try {
            const response = await fetch(`${QUEUE_URL}/${topic}/messages`, {
              method: "GET",
              headers: getAuthHeaders(),
            });

            if (response.ok) {
              const messages = await response.json();
              for (const msg of messages || []) {
                const lastId = this.lastMessageIds.get(topic);
                if (msg.id && msg.id !== lastId) {
                  this.lastMessageIds.set(topic, msg.id);
                  subscribers.forEach((cb) => cb(msg.payload || msg));
                }
              }
            }
          } catch {
            // Ignore polling errors
          }
        };

        const interval = setInterval(poll, 1000);
        this.pollIntervals.set(topic, interval);

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
        // Always publish locally first
        subscribers.forEach((cb) => cb(message));

        // Try ScoutOS queue if available
        if (!canUseScoutOSQueue()) {
          return;
        }

        try {
          await fetch(`${QUEUE_URL}/${topic}`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ message }),
          });
        } catch {
          // Ignore publish errors - local subscribers already notified
        }
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
  // Use ScoutOS adapter if APP_JWT is available
  if (canUseScoutOSQueue()) {
    return new ScoutOSQueueAdapter();
  }
  // Fall back to in-memory
  return new InMemoryAdapter();
}

// Singleton instance
let _instance: RealtimePort | null = null;

export function getRealtime(): RealtimePort {
  if (!_instance) {
    _instance = getRealtimeAdapter();
  }
  return _instance;
}

// Export adapters for testing
export { InMemoryAdapter, ScoutOSQueueAdapter };