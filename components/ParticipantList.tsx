"use client";

import { motion } from "framer-motion";
import type { Participant } from "@/types";
import { hasSubmittedAvailability } from "@/lib/bestTimes";

interface ParticipantListProps {
  participants: Participant[];
  currentParticipantId?: string;
}

// Color palette for participant avatars (cycling through primary, teal, pink)
const AVATAR_COLORS = [
  { bg: "bg-primary-100", text: "text-primary-500" },
  { bg: "bg-teal-100", text: "text-teal-600" },
  { bg: "bg-pink-100", text: "text-pink-500" },
  { bg: "bg-primary-100", text: "text-primary-600" },
  { bg: "bg-teal-100", text: "text-teal-500" },
  { bg: "bg-pink-100", text: "text-pink-400" },
];

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
          <span className="w-3 h-3 rounded-full bg-success" />
          <span className="text-neutral-500">
            {submitted.length} responded
          </span>
        </div>
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-neutral-300" />
          <span className="text-neutral-500">
            {pending.length} pending
          </span>
        </div>
      </div>

      {/* Participant rows */}
      <ul 
        className="space-y-2 list-none p-0 m-0" 
        role="list"
        aria-label="Participants"
      >
        {participants.map((participant, index) => {
          const hasSubmitted = hasSubmittedAvailability(participant);
          const isCurrentUser = participant.id === currentParticipantId;
          const colorScheme = AVATAR_COLORS[index % AVATAR_COLORS.length];

          return (
            <motion.li
              key={participant.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl list-none
                bg-neutral-100
                ${isCurrentUser ? "ring-2 ring-primary-500 ring-offset-1" : ""}
              `}
              aria-label={`${participant.name}${isCurrentUser ? " (you)" : ""}, ${hasSubmitted ? "has submitted availability" : "pending response"}`}
            >
              {/* Avatar */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-bold text-sm font-display flex-shrink-0
                  ${hasSubmitted ? colorScheme.bg : "bg-neutral-200"}
                  ${hasSubmitted ? colorScheme.text : "text-neutral-400"}
                `}
                aria-hidden="true"
              >
                {participant.name.charAt(0).toUpperCase()}
              </div>

              {/* Name + status */}
              <div className="flex-1 min-w-0">
                <span
                  className={`
                    font-semibold text-sm block truncate
                    ${hasSubmitted ? "text-neutral-900" : "text-neutral-500"}
                  `}
                >
                  {participant.name}
                  {isCurrentUser && (
                    <span className="sr-only">(you)</span>
                  )}
                  {isCurrentUser && (
                    <span className="text-neutral-400 font-normal" aria-hidden="true"> (You)</span>
                  )}
                </span>
              </div>

              {/* Status indicator */}
              {hasSubmitted ? (
                <span className="flex items-center gap-1.5 bg-success/10 text-success px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Done
                  <span className="sr-only"> Submitted</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-neutral-200 text-neutral-500 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                  Pending
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
          className="text-sm text-neutral-400"
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
      <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-primary-500 rounded-full"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${responded} of ${total} participants responded`}
        />
      </div>

      {/* Count */}
      <div className="text-sm text-neutral-500 whitespace-nowrap">
        <span className="sr-only">Progress: </span>
        <span className="font-semibold text-neutral-900">{responded}</span>/{total} responded
      </div>
    </div>
  );
}
