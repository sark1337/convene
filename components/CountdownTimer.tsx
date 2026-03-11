"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  expiresAt: Date;
  className?: string;
}

type UrgencyLevel = "normal" | "urgent" | "critical";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer({ expiresAt, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft());
  const [urgency, setUrgency] = useState<UrgencyLevel>(() => getUrgency());

  function getTimeLeft(): TimeLeft {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, total: diff };
  }

  function getUrgency(): UrgencyLevel {
    const diff = expiresAt.getTime() - Date.now();
    const hours = diff / (1000 * 60 * 60);
    if (hours < 1) return "critical";
    if (hours < 12) return "urgent";
    return "normal";
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
      setUrgency(getUrgency());
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const getTimeString = (): string => {
    if (timeLeft.total <= 0) return "Session has expired";
    const parts: string[] = [];
    if (timeLeft.hours > 0) parts.push(`${timeLeft.hours} hour${timeLeft.hours !== 1 ? "s" : ""}`);
    parts.push(`${timeLeft.minutes} minute${timeLeft.minutes !== 1 ? "s" : ""}`);
    return `${parts.join(", ")} remaining`;
  };

  if (timeLeft.total <= 0) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        role="alert"
        aria-live="assertive"
        className={`text-sm font-bold text-error ${className}`}
      >
        Expired
      </motion.span>
    );
  }

  // Compact display: "23h 42m"
  const display = timeLeft.hours > 0
    ? `${timeLeft.hours}h ${String(timeLeft.minutes).padStart(2, "0")}m`
    : `${timeLeft.minutes}m ${String(timeLeft.seconds).padStart(2, "0")}s`;

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {getTimeString()}
      </div>
      <span
        role="timer"
        aria-label={getTimeString()}
        className={`text-base font-bold font-display tabular-nums ${className}`}
      >
        {display}
        {urgency === "critical" && (
          <motion.span
            className="ml-1 inline-block w-2 h-2 rounded-full bg-error"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );
}
