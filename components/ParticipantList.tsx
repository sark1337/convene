"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types";
import { hasSubmittedAvailability } from "@/lib/bestTimes";

interface ParticipantListProps {
  participants: Participant[];
  currentParticipantId?: string;
}

export function ParticipantList({
  participants,
  currentParticipantId,
}: ParticipantListProps) {
  const submitted = participants.filter(hasSubmittedAvailability);
  const pending = participants.filter((p) => !hasSubmittedAvailability(p));

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div 
        className="flex items-center gap-4 text-sm"
        role="status"
        aria-live="polite"
        aria-label="Response summary"
      >
        <span className="sr-only">
          {submitted.length} of {participants.length} participants have responded. 
          {pending.length} pending.
        </span>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">
            {submitted.length} responded
          </span>
        </div>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="text-muted-foreground">
            {pending.length} pending
          </span>
        </div>
      </div>

      {/* Participant chips */}
      <ul 
        className="flex flex-wrap gap-2 list-none p-0 m-0" 
        role="list"
        aria-label="Participants"
      >
        {participants.map((participant, index) => {
          const hasSubmitted = hasSubmittedAvailability(participant);
          const isCurrentUser = participant.id === currentParticipantId;

          return (
            <motion.li
              key={participant.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-full list-none
                ${
                  hasSubmitted
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-gray-50 border border-gray-200"
                }
                ${isCurrentUser ? "ring-2 ring-primary" : ""}
              `}
              aria-label={`${participant.name}${isCurrentUser ? " (you)" : ""}, ${hasSubmitted ? "has submitted availability" : "pending response"}`}
            >
              {/* Avatar */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-medium text-sm
                  ${
                    hasSubmitted
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
                aria-hidden="true"
              >
                {participant.name.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span
                className={`
                  font-medium
                  ${hasSubmitted ? "text-emerald-900" : "text-gray-600"}
                `}
              >
                {participant.name}
                {isCurrentUser && (
                  <span className="sr-only">(you)</span>
                )}
                {isCurrentUser && (
                  <span aria-hidden="true"> (You)</span>
                )}
              </span>

              {/* Status indicator */}
              {hasSubmitted ? (
                <span className="text-emerald-500 text-lg" aria-label="Submitted">
                  ✓<span className="sr-only"> Submitted</span>
                </span>
              ) : (
                <span className="text-gray-400 text-xs">
                  pending
                  <span className="sr-only"> response</span>
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>

      {/* Pending reminder */}
      {pending.length > 0 && pending.length < participants.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          role="status"
          aria-live="polite"
          className="text-sm text-muted-foreground"
        >
          Waiting for {pending.map((p) => p.name).join(", ")} to respond
        </motion.p>
      )}
    </div>
  );
}

interface ParticipantSummaryProps {
  total: number;
  responded: number;
}

export function ParticipantSummary({ total, responded }: ParticipantSummaryProps) {
  const percentage = total > 0 ? Math.round((responded / total) * 100) : 0;

  return (
    <div 
      className="flex items-center gap-4"
      role="region"
      aria-label="Response progress"
    >
      {/* Progress bar */}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-emerald-500 rounded-full"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${responded} of ${total} participants responded`}
        />
      </div>

      {/* Count */}
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        <span className="sr-only">Progress: </span>
        {responded}/{total} responded ({percentage}%)
      </div>
    </div>
  );
}