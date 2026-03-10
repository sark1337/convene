/**
 * SSE (Server-Sent Events) Adapter for Realtime
 * Works with Next.js API routes for simple server-to-client updates
 */

import type { RealtimePort, RealtimeChannel, RealtimeMessage } from "../index";

export class SSEAdapter implements RealtimePort {
  private channels = new Map<string, SSEChannel>();

  isConnected(): boolean {
    return true;
  }

  createChannel(name: string): RealtimeChannel {
    if (this.channels.has(name)) {
      return this.channels.get(name)!;
    }
    
    const channel = new SSEChannel(name);
    this.channels.set(name, channel);
    return channel;
  }
}

class SSEChannel implements RealtimeChannel {
  private channelName: string;
  private clients = new Map<string, { send: (data: string) => void }>();

  constructor(name: string) {
    this.channelName = name;
  }

  // Add a client to receive updates
  addClient(clientId: string, send: (data: string) => void): () => void {
    this.clients.set(clientId, { send });
    return () => {
      this.clients.delete(clientId);
    };
  }

  subscribe(callback: (message: RealtimeMessage) => void): () => void {
    // For SSE, the client doesn't "subscribe" in the traditional sense
    // The server pushes updates via the SSE connection
    throw new Error("SSE adapter does not support subscribe. Use addClient instead.");
  }

  async publish(message: RealtimeMessage): Promise<void> {
    const data = `data: ${JSON.stringify(message)}\n\n`;
    this.clients.forEach((client) => {
      try {
        client.send(data);
      } catch (err) {
        console.error("Failed to send SSE message:", err);
      }
    });
  }

  async unsubscribe(): Promise<void> {
    this.clients.clear();
  }
}

// Export a singleton for SSE channel management
export const sseChannels = new Map<string, SSEChannel>();

export function getOrCreateSSEChannel(name: string): SSEChannel {
  if (!sseChannels.has(name)) {
    sseChannels.set(name, new SSEChannel(name));
  }
  return sseChannels.get(name)!;
}