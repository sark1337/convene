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
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    
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

  const formatNumber = (n: number) => String(n).padStart(2, "0");

  const urgencyStyles = {
    normal: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-200",
    },
    urgent: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    critical: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
  };

  const styles = urgencyStyles[urgency];

  // Generate accessible time string
  const getTimeString = (): string => {
    if (timeLeft.total <= 0) {
      return "Session has expired";
    }
    const parts: string[] = [];
    if (timeLeft.hours > 0) {
      parts.push(`${timeLeft.hours} hour${timeLeft.hours !== 1 ? "s" : ""}`);
    }
    parts.push(`${timeLeft.minutes} minute${timeLeft.minutes !== 1 ? "s" : ""}`);
    parts.push(`${timeLeft.seconds} second${timeLeft.seconds !== 1 ? "s" : ""}`);
    return `${parts.join(", ")} remaining until session expires`;
  };

  const getTimeAnnouncement = (): string => {
    if (timeLeft.total <= 0) {
      return "Session expired";
    }
    // For live regions, give less verbose updates
    const parts: string[] = [];
    if (timeLeft.hours > 0) {
      parts.push(`${timeLeft.hours}h`);
    }
    parts.push(`${timeLeft.minutes}m`);
    parts.push(`${timeLeft.seconds}s`);
    return `${parts.join(" ")} remaining`;
  };

  if (timeLeft.total <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                    bg-red-100 text-red-700 border border-red-200 ${className}`}
      >
        <span className="text-lg" aria-hidden="true">⚠️</span>
        <span className="font-semibold">Session Expired</span>
      </motion.div>
    );
  }

  return (
    <>
      {/* Polite live region for screen readers - updates every second but politelly */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {getTimeAnnouncement()}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        role="timer"
        aria-label={getTimeString()}
        aria-readonly="true"
        className={`relative inline-flex items-center gap-3 px-4 py-2 rounded-xl 
                    ${styles.bg} ${styles.text} border ${styles.border} ${className}`}
      >
        <span className="text-lg" aria-hidden="true">⏳</span>
        
        <div className="flex items-center gap-1 font-mono font-semibold" aria-hidden="true">
          {timeLeft.hours > 0 && (
            <>
              <span className="tabular-nums">{formatNumber(timeLeft.hours)}</span>
              <span className="opacity-50">h</span>
            </>
          )}
          <span className="tabular-nums">{formatNumber(timeLeft.minutes)}</span>
          <span className="opacity-50">m</span>
          <span className="tabular-nums">{formatNumber(timeLeft.seconds)}</span>
          <span className="opacity-50">s</span>
        </div>

        <span className="text-sm opacity-75" aria-hidden="true">remaining</span>

        {/* Pulse animation for critical - decorative */}
        {urgency === "critical" && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-red-400 opacity-20"
            animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </>
  );
}