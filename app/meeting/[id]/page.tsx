"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, eachDayOfInterval } from "date-fns";
import { CountdownTimer } from "@/components/CountdownTimer";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { HeatmapVisualization } from "@/components/HeatmapVisualization";
import type { Meeting, Participant } from "@/types";

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Participant form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Fetch meeting data
  useEffect(() => {
    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/meeting/${meetingId}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Meeting not found");
          } else {
            setError("Failed to load meeting");
          }
          return;
        }
        const data = await res.json();
        setMeeting(data.meeting);

        // Check for existing participant in localStorage
        const storedParticipantId = localStorage.getItem(`participant_${meetingId}`);
        if (storedParticipantId) {
          setParticipantId(storedParticipantId);
          // Fetch participant data
          const participantRes = await fetch(
            `/api/meeting/${meetingId}/participants/${storedParticipantId}`
          );
          if (participantRes.ok) {
            const participantData = await participantRes.json();
            setAvailability(new Set(participantData.participant.availability));
          }
        }
      } catch (err) {
        setError("Failed to load meeting");
      } finally {
        setLoading(false);
      }
    }

    fetchMeeting();
  }, [meetingId]);

  // Fetch participants
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

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  // Handle participant registration
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
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle availability change
  const handleAvailabilityChange = async (newAvailability: Set<string>) => {
    setAvailability(newAvailability);

    if (!participantId) return;

    // Optimistic update
    try {
      await fetch(
        `/api/meeting/${meetingId}/participants/${participantId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ availability: Array.from(newAvailability) }),
        }
      );
      // Refresh participants to update heatmap
      fetchParticipants();
    } catch (err) {
      console.error("Error saving availability:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{error}</h1>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-white rounded-xl"
          >
            Create a New Meeting
          </button>
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  const isExpired = new Date() > new Date(meeting.expiresAt);
  const isHost = false; // TODO: Check if current user is host

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold"
              >
                C
              </motion.div>
              <span className="text-xl font-semibold text-foreground">
                Convene
              </span>
            </div>
            {!isExpired && (
              <CountdownTimer expiresAt={new Date(meeting.expiresAt)} />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Meeting Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {meeting.title}
          </h1>
          <p className="text-muted-foreground">
            {format(new Date(meeting.dateRange.start), "MMM d")} -{" "}
            {format(new Date(meeting.dateRange.end), "MMM d, yyyy")}
          </p>
        </motion.div>

        {/* Expired warning */}
        {isExpired && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-8"
          >
            <span className="text-4xl mb-3 block">⚠️</span>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              This meeting has expired
            </h2>
            <p className="text-red-700">
              Session was active for 48 hours and has now ended.
            </p>
          </motion.div>
        )}

        {/* Participant registration */}
        {!participantId && !isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Enter your details</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Joining..." : "Continue"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Availability Grid */}
        {participantId && !isExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              Drag to select your availability
            </h2>
            <div className="bg-card border border-border rounded-2xl p-6">
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

        {/* Best Times Summary */}
        {participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Best Times</h2>
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

        {/* Participant List */}
        {participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              Participants ({participants.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{p.name}</span>
                  {p.availability.length > 0 && (
                    <span className="text-emerald-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}