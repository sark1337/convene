import { nanoid } from "nanoid";
import {
  setWithTTL,
  getAndRefresh,
  saddWithTTL,
  smembers,
  deleteKey,
  MEETING_TTL_SECONDS,
} from "./cache";
import type { Meeting, Participant, CreateMeetingInput, AddParticipantInput } from "@/types";

// Cache key helpers
export const CacheKeys = {
  meeting: (id: string) => `meeting:${id}`,
  participants: (meetingId: string) => `meeting:${meetingId}:participants`,
  participant: (meetingId: string, participantId: string) =>
    `meeting:${meetingId}:participant:${participantId}`,
};

/**
 * Create a new meeting
 */
export async function createMeeting(input: CreateMeetingInput): Promise<Meeting> {
  const id = nanoid(10);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + MEETING_TTL_SECONDS * 1000);

  const meeting: Meeting = {
    id,
    title: input.title,
    hostEmail: input.hostEmail,
    dateRange: {
      start: input.dateRange.start instanceof Date 
        ? input.dateRange.start 
        : new Date(input.dateRange.start),
      end: input.dateRange.end instanceof Date 
        ? input.dateRange.end 
        : new Date(input.dateRange.end),
    },
    timeRange: input.timeRange,
    createdAt: now,
    expiresAt,
  };

  await setWithTTL(CacheKeys.meeting(id), meeting);
  return meeting;
}

/**
 * Get a meeting by ID
 */
export async function getMeeting(id: string): Promise<Meeting | null> {
  return await getAndRefresh<Meeting>(CacheKeys.meeting(id));
}

/**
 * Update a meeting
 */
export async function updateMeeting(
  id: string,
  updates: Partial<Meeting>
): Promise<Meeting | null> {
  const meeting = await getMeeting(id);
  if (!meeting) return null;

  const updated = { ...meeting, ...updates };
  await setWithTTL(CacheKeys.meeting(id), updated);
  return updated;
}

/**
 * Delete a meeting and all its participants
 */
export async function deleteMeeting(id: string): Promise<void> {
  await deleteKey(CacheKeys.meeting(id));
  await deleteKey(CacheKeys.participants(id));
}

/**
 * Add a participant to a meeting
 */
export async function addParticipant(
  meetingId: string,
  input: AddParticipantInput
): Promise<Participant> {
  const id = nanoid(10);
  const now = new Date();

  const participant: Participant = {
    id,
    meetingId,
    name: input.name,
    email: input.email,
    availability: input.availability || [],
    submittedAt: now,
  };

  await setWithTTL(CacheKeys.participant(meetingId, id), participant);
  await saddWithTTL(CacheKeys.participants(meetingId), id);

  return participant;
}

/**
 * Get all participants for a meeting
 */
export async function getParticipants(meetingId: string): Promise<Participant[]> {
  const participantIds = await smembers(CacheKeys.participants(meetingId));
  const participants = await Promise.all(
    participantIds.map((id) => getAndRefresh<Participant>(CacheKeys.participant(meetingId, id)))
  );
  return participants.filter((p): p is Participant => p !== null);
}

/**
 * Get a specific participant
 */
export async function getParticipant(
  meetingId: string,
  participantId: string
): Promise<Participant | null> {
  return await getAndRefresh<Participant>(CacheKeys.participant(meetingId, participantId));
}

/**
 * Update participant's availability
 */
export async function updateParticipantAvailability(
  meetingId: string,
  participantId: string,
  availability: string[]
): Promise<Participant | null> {
  const participant = await getParticipant(meetingId, participantId);
  if (!participant) return null;

  const updated = { ...participant, availability, submittedAt: new Date() };
  await setWithTTL(CacheKeys.participant(meetingId, participantId), updated);
  return updated;
}

/**
 * Remove a participant
 */
export async function removeParticipant(
  meetingId: string,
  participantId: string
): Promise<void> {
  await deleteKey(CacheKeys.participant(meetingId, participantId));
}

/**
 * Finalize a meeting time slot
 */
export async function finalizeMeetingSlot(
  meetingId: string,
  slot: { start: Date; end: Date }
): Promise<Meeting | null> {
  return await updateMeeting(meetingId, {
    finalizedSlot: slot,
  });
}