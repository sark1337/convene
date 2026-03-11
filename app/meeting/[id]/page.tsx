"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, eachDayOfInterval } from "date-fns";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import type { Meeting, Participant } from "@/types";

// Avatar color palette matching design.pen
const AVATAR_COLORS = [
  { bg: "bg-primary-100", text: "text-primary-500" },
  { bg: "bg-teal-100", text: "text-teal-500" },
  { bg: "bg-pink-100", text: "text-pink-400" },
  { bg: "bg-primary-200", text: "text-primary-600" },
  { bg: "bg-teal-200", text: "text-teal-600" },
  { bg: "bg-pink-200", text: "text-pink-500" },
];

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/meeting/${meetingId}`);
        if (!res.ok) {
          setError(res.status === 404 ? "Meeting not found" : "Failed to load meeting");
          return;
        }
        const data = await res.json();
        setMeeting(data.meeting);

        const storedParticipantId = localStorage.getItem(`participant_${meetingId}`);
        if (storedParticipantId) {
          setParticipantId(storedParticipantId);
          const participantRes = await fetch(`/api/meeting/${meetingId}/participants/${storedParticipantId}`);
          if (participantRes.ok) {
            const participantData = await participantRes.json();
            setAvailability(new Set(participantData.participant.availability));
          }
        }
      } catch {
        setError("Failed to load meeting");
      } finally {
        setLoading(false);
      }
    }
    fetchMeeting();
  }, [meetingId]);

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch(`/api/meeting/${meetingId}/participants`);
      if (res.ok) {
        const data = await res.json();
        setParticipants(data.participants);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
    }
  }, [meetingId]);

  useEffect(() => { fetchParticipants(); }, [fetchParticipants]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/meeting/${meetingId}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, availability: [] }),
      });
      if (!res.ok) throw new Error("Failed to register");
      const data = await res.json();
      setParticipantId(data.participant.id);
      localStorage.setItem(`participant_${meetingId}`, data.participant.id);
    } catch {
      setError("Failed to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvailabilityChange = async (newAvailability: Set<string>) => {
    setAvailability(newAvailability);
    if (!participantId) return;
    try {
      await fetch(`/api/meeting/${meetingId}/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: Array.from(newAvailability) }),
      });
      fetchParticipants();
    } catch (err) {
      console.error("Error saving availability:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-primary-500 text-xl font-display font-bold">
          Loading...
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4 font-display">{error}</h1>
          <button onClick={() => router.push("/")} className="px-7 py-3 bg-primary-500 text-white rounded-3xl font-semibold shadow-primary hover:bg-primary-600 transition-colors">
            Create a New Meeting
          </button>
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  const isExpired = new Date() > new Date(meeting.expiresAt);
  const isHost = false;
  const respondedCount = participants.filter(p => p.availability.length > 0).length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-neutral-200/50">
        <div className="mx-auto max-w-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push("/")} className="w-10 h-10 rounded-[14px] bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors" aria-label="Go back">
                <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight font-display">{meeting.title}</h1>
            </div>
            <button className="w-10 h-10 rounded-[14px] bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors" aria-label="Share meeting">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-4 space-y-5">
        {/* Timer bar - matching design.pen */}
        {!isExpired && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-primary-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-sm font-medium text-primary-500">Expires in</span>
            </div>
            <CountdownTimer expiresAt={new Date(meeting.expiresAt)} className="text-primary-500 font-bold font-display" />
          </div>
        )}

        {/* Expired warning */}
        {isExpired && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-error-light border border-error/20 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-bold text-error mb-1 font-display">This meeting has expired</h2>
            <p className="text-sm text-error/80">Session was active for 48 hours and has now ended.</p>
          </motion.div>
        )}

        {/* Participant registration - matching design.pen join-section */}
        {!participantId && !isExpired && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block text-sm font-semibold text-neutral-500 mb-2">Your name</label>
            <form onSubmit={handleRegister} className="flex gap-2.5">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 rounded-2xl bg-neutral-100 text-neutral-900 placeholder:text-neutral-400 font-body focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Enter your name"
              />
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="px-6 py-3.5 bg-primary-500 text-white rounded-3xl font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors shadow-primary"
              >
                {submitting ? "..." : "Join"}
              </button>
            </form>
            {/* Hidden email field for basic registration */}
            <input type="hidden" value={email} onChange={(e) => setEmail(e.target.value)} />
          </motion.div>
        )}

        {/* Availability Grid - matching design.pen grid-section */}
        {participantId && !isExpired && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-3 font-display">
              Tap your available times
            </h2>
            <div className="bg-neutral-100 rounded-2xl p-3">
              <AvailabilityGrid
                dateRange={{
                  start: new Date(meeting.dateRange.start),
                  end: new Date(meeting.dateRange.end),
                }}
                timeRange={meeting.timeRange}
                availability={availability}
                onChange={handleAvailabilityChange}
                showHeatmap={participants.length > 1}
                participants={participants.map((p) => ({
                  name: p.name,
                  availability: new Set(p.availability),
                }))}
              />
            </div>
          </motion.div>
        )}

        {/* Best Times Summary - matching design.pen Screen 4 */}
        {participants.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <HeatmapVisualization
              participants={participants.map((p) => ({
                name: p.name,
                email: p.email,
                availability: p.availability,
              }))}
              dateRange={{
                start: new Date(meeting.dateRange.start),
                end: new Date(meeting.dateRange.end),
              }}
              timeRange={meeting.timeRange}
              isHost={isHost}
            />
          </motion.div>
        )}

        {/* Participants - matching design.pen participant rows */}
        {participants.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight font-display">Participants</h2>
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-500 text-xs font-semibold">
                {respondedCount} / {participants.length} responded
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {participants.map((p, i) => {
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const hasSubmitted = p.availability.length > 0;
                return (
                  <div key={p.id} className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-neutral-100">
                    <div className={`w-9 h-9 rounded-full ${color.bg} flex items-center justify-center ${color.text} font-bold text-sm font-display shrink-0`}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 text-sm truncate">{p.name}</p>
                      <p className={`text-xs ${hasSubmitted ? "text-emerald-500" : "text-amber-500"}`}>
                        {hasSubmitted ? "Submitted" : "Pending..."}
                      </p>
                    </div>
                    {hasSubmitted ? (
                      <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" strokeDasharray="4 4" /></svg>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
