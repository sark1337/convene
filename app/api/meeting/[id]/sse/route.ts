/**
 * SSE (Server-Sent Events) endpoint for realtime updates
 * Clients connect to this endpoint to receive live participant updates
 * 
 * Uses ScoutOS Cache port for data retrieval and polls for changes.
 */

import { NextRequest } from "next/server";
import { smembers, getAndRefresh } from "@/lib/cache";
import type { Participant } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Set up SSE headers
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Send initial connection message
  await writer.write(encoder.encode(`data: ${JSON.stringify({ type: "connected", meetingId: id })}\n\n`));

  // Start polling cache for updates
  const pollInterval = setInterval(async () => {
    try {
      // Get participant IDs
      const participantIds = await smembers(`meeting:${id}:participants`);
      
      // Get participant data
      const participants = await Promise.all(
        participantIds.map(async (pid) => {
          const data = await getAndRefresh<Participant>(`meeting:${id}:participant:${pid}`);
          return data;
        })
      );
      
      const validParticipants = participants.filter((p): p is Participant => p !== null);
      
      await writer.write(encoder.encode(
        `data: ${JSON.stringify({ type: "participants_update", participants: validParticipants })}\n\n`
      ));
    } catch (error) {
      console.error("SSE poll error:", error);
    }
  }, 3000); // Poll every 3 seconds

  // Clean up on disconnect
  request.signal.addEventListener("abort", () => {
    clearInterval(pollInterval);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}