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

  // Get score color
  const getScoreColor = (score: number) => {
    if (score === 1) return "bg-emerald-500 text-white";
    if (score >= 0.75) return "bg-emerald-400 text-emerald-900";
    if (score >= 0.5) return "bg-emerald-300 text-emerald-900";
    if (score >= 0.25) return "bg-emerald-200 text-emerald-900";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Perfect slots */}
      {bestSlots.perfect.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⭐</span>
            <h3 className="text-lg font-semibold text-emerald-900">
              Perfect Time Slots
            </h3>
          </div>
          <p className="text-sm text-emerald-700 mb-4">
            Everyone is available at these times:
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
                  w-full text-left px-4 py-3 rounded-xl
                  bg-emerald-100 hover:bg-emerald-200
                  transition-colors duration-200
                  ${isHost ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div className="font-medium text-emerald-900">
                  {formatSlot(slot)}
                </div>
                <div className="text-sm text-emerald-700">
                  {slot.available.length} participants available
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Good slots */}
      {bestSlots.nearPerfect.length > 0 && bestSlots.perfect.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👍</span>
            <h3 className="text-lg font-semibold text-amber-900">
              Best Available Times
            </h3>
          </div>
          <p className="text-sm text-amber-700 mb-4">
            Most participants are available at these times:
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
                  w-full text-left px-4 py-3 rounded-xl
                  bg-amber-100 hover:bg-amber-200
                  transition-colors duration-200
                  ${isHost ? "cursor-pointer" : "cursor-default"}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-amber-900">
                      {formatSlot(slot)}
                    </div>
                    <div className="text-sm text-amber-700">
                      {slot.available.length}/{participants.length} available
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded ${getScoreColor(slot.score)}`}>
                    {Math.round(slot.score * 100)}%
                  </div>
                </div>
                <div className="text-xs text-amber-600 mt-1">
                  Missing: {slot.unavailable.join(", ")}
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
          className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center"
        >
          <span className="text-4xl block mb-3">📅</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Waiting for Responses
          </h3>
          <p className="text-sm text-gray-600">
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
          <p className="text-sm text-gray-600 mb-3">
            As the host, click a time slot above to confirm the meeting.
          </p>
          <p className="text-xs text-gray-500">
            All participants will receive an email confirmation with calendar attachment.
          </p>
        </motion.div>
      )}
    </div>
  );
}