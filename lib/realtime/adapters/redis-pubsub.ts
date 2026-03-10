/**
 * Redis Pub/Sub Adapter for Realtime
 * Uses Upstash Redis for production WebSocket-like functionality
 */

import { Redis } from "@upstash/redis";
import type { RealtimePort, RealtimeChannel, RealtimeMessage } from "../index";

// Get Redis client from main config
const getRedis = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token || !url.startsWith("https://") || url.includes("your_")) {
    return null;
  }
  
  return new Redis({ url, token });
};

export class RedisPubSubAdapter implements RealtimePort {
  private redis: Redis | null;
  private channels = new Map<string, RedisChannel>();

  constructor() {
    this.redis = getRedis();
  }

  isConnected(): boolean {
    return this.redis !== null;
  }

  createChannel(name: string): RealtimeChannel {
    if (this.channels.has(name)) {
      return this.channels.get(name)!;
    }
    
    const channel = new RedisChannel(name, this.redis);
    this.channels.set(name, channel);
    return channel;
  }
}

class RedisChannel implements RealtimeChannel {
  private redis: Redis | null;
  private channelName: string;
  private subscribers = new Set<(message: RealtimeMessage) => void>();
  private isSubscribed = false;

  constructor(name: string, redis: Redis | null) {
    this.channelName = name;
    this.redis = redis;
  }

  subscribe(callback: (message: RealtimeMessage) => void): () => void {
    this.subscribers.add(callback);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  async publish(message: RealtimeMessage): Promise<void> {
    if (!this.redis) return;

    // Use Redis PUBLISH command
    await this.redis.publish(
      `channel:${this.channelName}`,
      JSON.stringify(message)
    );
  }

  async unsubscribe(): Promise<void> {
    this.subscribers.clear();
    this.isSubscribed = false;
  }
}

// Note: For true real-time updates, you need a WebSocket server
// that subscribes to Redis channels. This adapter works with:
// - Socket.io + Redis adapter
// - Pusher with Redis backend
// - Or Next.js API routes polling
// 
// For ScoutOS Live deployment, consider using:
// - WebSocket server in the same container
// - Server-Sent Events (SSE) for simpler server-to-client updates