"use client";

import { useState, useEffect } from "react";
import { formatInUserTimezone, getCommonTimezones, getTzAbbreviation, setStoredTimezone } from "@/lib/timezone";

interface TimezoneSelectorProps {
  onTimezoneChange?: (timezone: string) => void;
  className?: string;
}

export function TimezoneSelector({ onTimezoneChange, className = "" }: TimezoneSelectorProps) {
  const [timezone, setTimezone] = useState<string>("");
  const [tzAbbrev, setTzAbbrev] = useState<string>("");

  useEffect(() => {
    // Get stored timezone on mount
    const stored = localStorage.getItem("convene_timezone");
    if (stored) {
      setTimezone(stored);
      setTzAbbrev(getTzAbbreviation(stored));
    } else {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detected);
      setTzAbbrev(getTzAbbreviation(detected));
      localStorage.setItem("convene_timezone", detected);
    }
  }, []);

  const handleChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    setTzAbbrev(getTzAbbreviation(newTimezone));
    setStoredTimezone(newTimezone);
    onTimezoneChange?.(newTimezone);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-neutral-400 font-medium">
        {tzAbbrev}
      </span>
      <select
        value={timezone}
        onChange={(e) => handleChange(e.target.value)}
        className="text-sm bg-neutral-100 border-none rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none text-neutral-700 appearance-none
                   bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhMWExYWEiIHN0cm9rZS13aWR0aD0iMiI+PHBhdGggZD0iTTYgOWw2IDYgNi02Ii8+PC9zdmc+')]
                   bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem] pr-8"
        aria-label="Select timezone"
      >
        {getCommonTimezones().map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TimeDisplayProps {
  date: Date | string;
  format?: string;
  timezone?: string;
  showTz?: boolean;
  className?: string;
}

export function TimeDisplay({
  date,
  format = "MMM d, yyyy h:mm a",
  timezone,
  showTz = true,
  className = "",
}: TimeDisplayProps) {
  const [display, setDisplay] = useState<string>("");
  const [tz, setTz] = useState<string>("");

  useEffect(() => {
    const tzToUse = timezone || localStorage.getItem("convene_timezone") || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    try {
      const formatted = formatInUserTimezone(dateObj, format, tzToUse);
      setDisplay(formatted);
      setTz(getTzAbbreviation(tzToUse, dateObj));
    } catch {
      setDisplay(dateObj.toLocaleString());
      setTz("");
    }
  }, [date, format, timezone]);

  return (
    <span className={className}>
      {display}
      {showTz && tz && (
        <span className="text-neutral-400 ml-1 text-xs">({tz})</span>
      )}
    </span>
  );
}
