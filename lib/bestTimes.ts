import type { Meeting, Participant } from "@/types";

export interface TimeSlot {
  start: Date;
  end: Date;
  availableCount: number;
  totalCount: number;
  percentage: number;
  isPerfect: boolean;
  availableParticipants: string[];
  unavailableParticipants: string[];
}

/**
 * Calculate the best time slots based on participant availability
 */
export function calculateBestTimes(
  meeting: Meeting,
  participants: Participant[],
  topN: number = 5
): TimeSlot[] {
  if (participants.length === 0) return [];

  const [startHour] = meeting.timeRange.start.split(":").map(Number);
  const [endHour] = meeting.timeRange.end.split(":").map(Number);

  const startDate = new Date(meeting.dateRange.start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(meeting.dateRange.end);
  endDate.setHours(23, 59, 59, 999);

  const slots: { start: Date; end: Date; count: number; names: string[] }[] = [];

  // Generate all possible time slots (hourly)
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(currentDate);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(currentDate);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      const availableParticipants = participants.filter((p) =>
        p.availability.some((a) => {
          const availDate = new Date(a);
          return (
            availDate.getFullYear() === slotStart.getFullYear() &&
            availDate.getMonth() === slotStart.getMonth() &&
            availDate.getDate() === slotStart.getDate() &&
            availDate.getHours() === slotStart.getHours()
          );
        })
      );

      slots.push({
        start: slotStart,
        end: slotEnd,
        count: availableParticipants.length,
        names: availableParticipants.map((p) => p.name),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Sort by count descending and get top N
  const sortedSlots = slots
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);

  // Convert to TimeSlot format
  return sortedSlots.map((slot) => ({
    start: slot.start,
    end: slot.end,
    availableCount: slot.count,
    totalCount: participants.length,
    percentage: Math.round((slot.count / participants.length) * 100),
    isPerfect: slot.count === participants.length,
    availableParticipants: slot.names,
    unavailableParticipants: participants
      .filter((p) => !slot.names.includes(p.name))
      .map((p) => p.name),
  }));
}

/**
 * Get perfect slots (100% availability)
 */
export function getPerfectSlots(
  meeting: Meeting,
  participants: Participant[]
): TimeSlot[] {
  const bestTimes = calculateBestTimes(meeting, participants, 50);
  return bestTimes.filter((slot) => slot.isPerfect);
}

/**
 * Get slots sorted by availability percentage
 */
export function getSlotsByAvailability(
  meeting: Meeting,
  participants: Participant[],
  minPercentage: number = 0
): TimeSlot[] {
  const bestTimes = calculateBestTimes(meeting, participants, 50);
  return bestTimes.filter((slot) => slot.percentage >= minPercentage);
}

/**
 * Format a time slot for display
 */
export function formatSlot(slot: TimeSlot): string {
  const day = slot.start.toLocaleDateString("en-US", { weekday: "short" });
  const date = slot.start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const time = slot.start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day}, ${date} at ${time}`;
}

/**
 * Check if a participant has submitted availability
 */
export function hasSubmittedAvailability(participant: Participant): boolean {
  return participant.availability && participant.availability.length > 0;
}