import ics from "ics";
import type { Meeting } from "@/types";

export interface CalendarEvent {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  url?: string;
  organizer?: { name: string; email: string };
  attendees?: Array<{ name: string; email: string }>;
}

export function generateICS(event: CalendarEvent): Promise<string> {
  return new Promise((resolve, reject) => {
    const icsEvent: ics.EventAttributes = {
      title: event.title,
      description: event.description,
      start: [
        event.start.getFullYear(),
        event.start.getMonth() + 1,
        event.start.getDate(),
        event.start.getHours(),
        event.start.getMinutes(),
      ],
      end: [
        event.end.getFullYear(),
        event.end.getMonth() + 1,
        event.end.getDate(),
        event.end.getHours(),
        event.end.getMinutes(),
      ],
      location: event.location,
      url: event.url,
      status: "CONFIRMED",
      organizer: event.organizer
        ? { name: event.organizer.name, email: event.organizer.email }
        : undefined,
      attendees: event.attendees?.map((a) => ({
        name: a.name,
        email: a.email,
        rsvp: true,
        partstat: "NEEDS-ACTION",
        role: "REQ-PARTICIPANT",
      })),
    };

    ics.createEvent(icsEvent, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value || "");
      }
    });
  });
}

export async function generateMeetingICS(
  meeting: Meeting,
  finalizedSlot: { start: Date; end: Date },
  participants: Array<{ name: string; email: string }>,
  hostName: string
): Promise<string> {
  const event: CalendarEvent = {
    title: meeting.title,
    description: `Meeting scheduled via Convene\n\nView details: ${process.env.NEXT_PUBLIC_BASE_URL || "https://convene.scoutos.live"}/meeting/${meeting.id}`,
    start: finalizedSlot.start,
    end: finalizedSlot.end,
    organizer: { name: hostName, email: meeting.hostEmail },
    attendees: participants.map((p) => ({ name: p.name, email: p.email })),
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://convene.scoutos.live"}/meeting/${meeting.id}`,
  };

  return generateICS(event);
}