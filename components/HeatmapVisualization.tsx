"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface HeatmapVisualizationProps {
  participants: {
    name: string;
    email: string;
    availability: string[]; // ISO strings
  }[];
  dateRange: { start: Date; end: Date };
  timeRange: { start: string; end: string };
  onSlotSelect?: (slot: { start: Date; end: Date }) => void;
  isHost?: boolean;
}

interface SlotData {
  start: Date;
  end: Date;
  available: string[];
  unavailable: string[];
  score: number;
}

export function HeatmapVisualization({
  participants,
  dateRange,
  timeRange,
  onSlotSelect,
  isHost = false,
}: HeatmapVisualizationProps) {
  // Calculate best slots
  const slots = useMemo(() => {
    const result: SlotData[] = [];
    
    const startHour = parseInt(timeRange.start.split(":")[0], 10);
    const endHour = parseInt(timeRange.end.split(":")[0], 10);
    
    // Generate all possible slots
    const currentDate = new Date(dateRange.start);
    while (currentDate <= dateRange.end) {
      for (let hour = startHour; hour < endHour; hour++) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(currentDate);
        slotEnd.setHours(hour + 1, 0, 0, 0);
        
        const available = participants.filter((p) =>
          p.availability.includes(slotStart.toISOString())
        );
        const unavailable = participants.filter(
          (p) => !p.availability.includes(slotStart.toISOString())
        );
        
        result.push({
          start: slotStart,
          end: slotEnd,
          available: available.map((p) => p.name),
          unavailable: unavailable.map((p) => p.name),
          score: available.length / participants.length,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Sort by score descending
    return result.sort((a, b) => b.score - a.score);
  }, [participants, dateRange, timeRange]);

  // Get top 5 best slots
  const bestSlots = useMemo(() => {
    const perfectSlots = slots.filter((s) => s.score === 1);
    const nearPerfectSlots = slots.filter((s) => s.score >= 0.75 && s.score < 1);
    
    return {
      perfect: perfectSlots,
      nearPerfect: nearPerfectSlots.slice(0, 5),
    };
  }, [slots]);

  // Format time for display
  const formatSlot = (slot: SlotData) => {
    const day = slot.start.toLocaleDateString("en-US", { weekday: "short" });
    const date = slot.start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const time = slot.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${day}, ${date} at ${time}`;
  };

  return (
    <div className="space-y-5">
      {/* Perfect slots - gradient card */}
      {bestSlots.perfect.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-success to-teal-500 rounded-3xl p-6 text-white"
        >
          <h3 className="text-lg font-bold font-display mb-1">
            Perfect Match
          </h3>
          <p className="text-sm text-white/80 mb-4">
            Everyone can make these times
          </p>
          <div className="space-y-2">
            {bestSlots.perfect.slice(0, 3).map((slot, idx) => (
              <motion.button
                key={`${slot.start.toISOString()}-${idx}`}
                onClick={() => onSlotSelect?.(slot)}
                disabled={!isHost}
                whileHover={isHost ? { scale: 1.02 } : {}}
                whileTap={isHost ? { scale: 0.98 } : {}}
                className={`
                  w-full text-left px-4 py-3 rounded-2xl
                  bg-white/20 backdrop-blur-sm hover:bg-white/30
                  transition-colors duration-200
                  ${isHost ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">
                      {formatSlot(slot)}
                    </div>
                    <div className="text-sm text-white/70">
                      {slot.available.length} participants available
                    </div>
                  </div>
                  <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    100%
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Good slots - card on neutral surface */}
      {bestSlots.nearPerfect.length > 0 && bestSlots.perfect.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-100 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold font-display text-neutral-900 mb-1">
            Best Available Times
          </h3>
          <p className="text-sm text-neutral-500 mb-4">
            Most participants can make these
          </p>
          <div className="space-y-2">
            {bestSlots.nearPerfect.slice(0, 5).map((slot, idx) => (
              <motion.button
                key={`${slot.start.toISOString()}-${idx}`}
                onClick={() => onSlotSelect?.(slot)}
                disabled={!isHost}
                whileHover={isHost ? { scale: 1.02 } : {}}
                whileTap={isHost ? { scale: 0.98 } : {}}
                className={`
                  w-full text-left px-4 py-3 rounded-2xl
                  bg-white hover:bg-neutral-50
                  transition-colors duration-200
                  ${isHost ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-neutral-900">
                      {formatSlot(slot)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {slot.available.length}/{participants.length} available
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    slot.score >= 0.75 
                      ? "bg-teal-100 text-teal-600"
                      : "bg-neutral-200 text-neutral-600"
                  }`}>
                    {Math.round(slot.score * 100)}%
                  </span>
                </div>
                {slot.unavailable.length > 0 && (
                  <div className="text-xs text-neutral-400 mt-1">
                    Missing: {slot.unavailable.join(", ")}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Near-perfect also shown below perfect */}
      {bestSlots.nearPerfect.length > 0 && bestSlots.perfect.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-neutral-100 rounded-3xl p-6"
        >
          <h3 className="text-base font-bold font-display text-neutral-900 mb-1">
            Other Good Times
          </h3>
          <p className="text-sm text-neutral-500 mb-3">
            Almost everyone is free
          </p>
          <div className="space-y-2">
            {bestSlots.nearPerfect.slice(0, 3).map((slot, idx) => (
              <motion.button
                key={`${slot.start.toISOString()}-${idx}`}
                onClick={() => onSlotSelect?.(slot)}
                disabled={!isHost}
                whileHover={isHost ? { scale: 1.02 } : {}}
                whileTap={isHost ? { scale: 0.98 } : {}}
                className={`
                  w-full text-left px-4 py-3 rounded-2xl
                  bg-white hover:bg-neutral-50
                  transition-colors duration-200
                  ${isHost ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-neutral-900 text-sm">
                      {formatSlot(slot)}
                    </div>
                    <div className="text-xs text-neutral-400">
                      Missing: {slot.unavailable.join(", ")}
                    </div>
                  </div>
                  <span className="bg-teal-100 text-teal-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    {Math.round(slot.score * 100)}%
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* No slots with availability */}
      {bestSlots.perfect.length === 0 && bestSlots.nearPerfect.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-100 rounded-3xl p-8 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold font-display text-neutral-900 mb-1">
            Waiting for Responses
          </h3>
          <p className="text-sm text-neutral-500">
            Once participants submit their availability, the best times will appear here.
          </p>
        </motion.div>
      )}

      {/* Host finalize prompt */}
      {isHost && bestSlots.perfect.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-sm text-neutral-500 mb-1">
            As the host, click a time slot above to confirm the meeting.
          </p>
          <p className="text-xs text-neutral-400">
            All participants will receive an email confirmation with calendar attachment.
          </p>
        </motion.div>
      )}
    </div>
  );
}
