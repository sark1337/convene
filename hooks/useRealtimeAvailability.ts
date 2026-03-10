/**
 * Realtime hook for Convene
 * Uses the ports & adapters pattern for flexibility
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { getRealtime, type RealtimeMessage } from "@/lib/realtime";
import type { Participant } from "@/types";

interface UseRealtimeAvailabilityOptions {
  meetingId: string;
  initialParticipants: Participant[];
  onParticipantJoin?: (participant: Participant) => void;
}

interface ParticipantUpdate {
  participantId: string;
  availability: string[];
}

export function useRealtimeAvailability({
  meetingId,
  initialParticipants,
  onParticipantJoin,
}: UseRealtimeAvailabilityOptions) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [isConnected, setIsConnected] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Handle availability update from another client
  const handleAvailabilityUpdate = useCallback(
    (message: RealtimeMessage) => {
      if (message.type === "availability_update") {
        const { participantId, availability } = message.payload as ParticipantUpdate;
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === participantId ? { ...p, availability } : p
          )
        );
      }
      
      if (message.type === "participant_join") {
        const participant = message.payload as Participant;
        setParticipants((prev) => {
          if (prev.find((p) => p.id === participant.id)) {
            return prev;
          }
          return [...prev, participant];
        });
        onParticipantJoin?.(participant);
      }
    },
    [onParticipantJoin]
  );

  // Subscribe to realtime channel on mount
  useEffect(() => {
    let mounted = true;

    async function connect() {
      try {
        const realtime = await getRealtime();
        if (!mounted) return;

        const channel = realtime.createChannel(`meeting:${meetingId}`);
        const unsubscribe = channel.subscribe(handleAvailabilityUpdate);
        
        unsubscribeRef.current = unsubscribe;
        setIsConnected(realtime.isConnected());
      } catch (error) {
        console.warn("Realtime connection failed, using polling fallback:", error);
        
        // Fall back to polling
        const pollInterval = setInterval(async () => {
          try {
            const res = await fetch(`/api/meeting/${meetingId}/participants`);
            if (res.ok) {
              const data = await res.json();
              if (mounted) {
                setParticipants(data.participants);
              }
            }
          } catch (err) {
            console.error("Error polling participants:", err);
          }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollInterval);
      }
    }

    connect();

    return () => {
      mounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [meetingId, handleAvailabilityUpdate]);

  // Broadcast local availability change
  const updateAvailability = useCallback(
    async (participantId: string, availability: string[]) => {
      // Optimistically update local state
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, availability } : p
        )
      );

      // Broadcast to other clients
      try {
        const realtime = await getRealtime();
        const channel = realtime.createChannel(`meeting:${meetingId}`);
        await channel.publish({
          type: "availability_update",
          payload: { participantId, availability },
          timestamp: Date.now(),
        });
      } catch (error) {
        // Connection issues - still update locally, API will sync
        console.warn("Failed to broadcast availability update:", error);
      }
    },
    [meetingId]
  );

  // Announce new participant
  const announceParticipant = useCallback(
    async (participant: { id: string; name: string; email: string }) => {
      try {
        const realtime = await getRealtime();
        const channel = realtime.createChannel(`meeting:${meetingId}`);
        await channel.publish({
          type: "participant_join",
          payload: participant,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.warn("Failed to announce participant:", error);
      }
    },
    [meetingId]
  );

  return {
    participants,
    isConnected,
    updateAvailability,
    announceParticipant,
  };
}