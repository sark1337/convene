/**
 * Timezone utilities for Convene
 * Handles detection, conversion, and display of times in user's local timezone
 */

import { format, formatInTimeZone, toDate, toZonedTime } from "date-fns-tz";

const TIMEZONE_STORAGE_KEY = "convene_timezone";

/**
 * Get the user's detected timezone
 */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "America/New_York"; // Fallback
  }
}

/**
 * Get the stored timezone preference, or detect if not set
 */
export function getStoredTimezone(): string {
  if (typeof window === "undefined") {
    return detectTimezone();
  }
  
  const stored = localStorage.getItem(TIMEZONE_STORAGE_KEY);
  if (stored) {
    return stored;
  }
  
  const detected = detectTimezone();
  localStorage.setItem(TIMEZONE_STORAGE_KEY, detected);
  return detected;
}

/**
 * Store timezone preference
 */
export function setStoredTimezone(timezone: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone);
  }
}

/**
 * Format a date in the user's timezone
 */
export function formatInUserTimezone(
  date: Date | string,
  formatStr: string = "MMM d, yyyy h:mm a",
  timezone?: string
): string {
  const tz = timezone || getStoredTimezone();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatInTimeZone(dateObj, tz, formatStr);
}

/**
 * Format a time slot for display
 */
export function formatTimeSlot(
  date: Date | string,
  timezone?: string
): { time: string; date: string; full: string; tz: string } {
  const tz = timezone || getStoredTimezone();
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return {
    time: formatInTimeZone(dateObj, tz, "h:mm a"),
    date: formatInTimeZone(dateObj, tz, "EEE, MMM d"),
    full: formatInTimeZone(dateObj, tz, "EEEE, MMMM d, yyyy 'at' h:mm a"),
    tz: getTzAbbreviation(tz, dateObj),
  };
}

/**
 * Get timezone abbreviation (e.g., "EST", "PST")
 */
export function getTzAbbreviation(timezone: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName");
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
}

/**
 * Get current time in a timezone
 */
export function getCurrentTimeInTimezone(timezone: string): Date {
  return toZonedTime(new Date(), timezone);
}

/**
 * Convert UTC to a timezone
 */
export function utcToLocal(utcDate: Date, timezone: string): Date {
  return toZonedTime(utcDate, timezone);
}

/**
 * Get list of common timezones
 */
export function getCommonTimezones(): { value: string; label: string }[] {
  return [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "America/Anchorage", label: "Alaska Time (AKT)" },
    { value: "Pacific/Honolulu", label: "Hawaii Time (HST)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Europe/Berlin", label: "Berlin (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
  ];
}

/**
 * Get user-friendly timezone offset
 */
export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset",
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((p) => p.type === "timeZoneName");
    return offsetPart?.value || "";
  } catch {
    return "";
  }
}

/**
 * Check if two timezones are the same
 */
export function isSameTimezone(tz1: string, tz2: string): boolean {
  try {
    const now = new Date();
    const offset1 = getTimezoneOffset(tz1);
    const offset2 = getTimezoneOffset(tz2);
    return offset1 === offset2;
  } catch {
    return tz1 === tz2;
  }
}