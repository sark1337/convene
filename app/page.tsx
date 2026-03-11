"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { addDays } from "date-fns";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";
import { CountdownTimer } from "@/components/CountdownTimer";

// Demo expiry for countdown preview
const DEMO_EXPIRY = addDays(new Date(), 2);

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMeeting = async (data: {
    title: string;
    hostEmail: string;
    dateRange: { start: Date; end: Date };
    timeRange: { start: string; end: string };
  }) => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create meeting");

      const { meeting } = await res.json();
      router.push(`/meeting/${meeting.id}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header - glassmorphic */}
      <header role="banner" className="sticky top-0 bg-white/80 backdrop-blur-xl z-50 border-b border-neutral-200/50">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <nav className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25"
              >
                <span className="text-white font-bold text-lg">C</span>
              </motion.div>
              <span className="text-xl font-bold text-neutral-900 tracking-tight font-display">
                Convene
              </span>
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main" className="mx-auto max-w-2xl px-6">
        {/* Hero Section - matching design Screen 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-10 pb-8 text-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-500 text-sm font-semibold mb-6"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Find time in seconds
          </motion.div>

          {/* Big headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.1] mb-4 font-display">
            When can everyone meet?
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-500 leading-relaxed max-w-md mx-auto mb-8">
            Share a link. Pick your times. Convene finds the perfect slot &mdash; all in under 48 hours.
          </p>

          {/* CTA button */}
          <motion.a
            href="#create-meeting"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-3xl bg-primary-500 text-white font-semibold text-base shadow-primary hover:bg-primary-600 transition-colors"
          >
            Create Meeting
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </motion.a>

          {/* Illustration - avatar group */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 mx-auto w-72 h-40 rounded-3xl bg-gradient-to-br from-primary-100 via-teal-100 to-pink-100 flex items-center justify-center gap-[-8px]"
          >
            <div className="flex items-center -space-x-3">
              <div className="w-13 h-13 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-bold text-xl font-display ring-4 ring-white" style={{width:52,height:52}}>S</div>
              <div className="w-15 h-15 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 font-bold text-2xl font-display ring-4 ring-white z-10" style={{width:60,height:60}}>M</div>
              <div className="w-13 h-13 rounded-full bg-pink-100 flex items-center justify-center text-pink-400 font-bold text-xl font-display ring-4 ring-white" style={{width:52,height:52}}>J</div>
            </div>
            <svg className="w-9 h-9 text-primary-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            </svg>
          </motion.div>
        </motion.section>

        {/* How it Works - matching design Screen 1 steps */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pb-8"
          aria-labelledby="how-it-works-heading"
        >
          <h2 id="how-it-works-heading" className="text-xl font-bold text-neutral-900 tracking-tight mb-5 font-display">
            How it works
          </h2>

          <div className="flex flex-col gap-4">
            {[
              { num: "1", title: "Create a meeting", desc: "Pick a title, date range & time window", color: "bg-primary-500" },
              { num: "2", title: "Share the link", desc: "Friends tap to mark their free times", color: "bg-teal-500" },
              { num: "3", title: "Convene finds the match", desc: "Best times auto-ranked \u2014 confirm in one tap", color: "bg-pink-400" },
            ].map((step) => (
              <motion.div
                key={step.num}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-100 transition-colors hover:bg-neutral-200/60"
              >
                <div className={`w-10 h-10 shrink-0 rounded-[14px] ${step.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg font-display">{step.num}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 text-base">{step.title}</p>
                  <p className="text-sm text-neutral-500 leading-snug">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 48-hour Countdown Teaser - matching design gradient card */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-8"
        >
          <div className="rounded-3xl bg-gradient-to-r from-primary-500 to-primary-700 p-5 flex items-center gap-4">
            <svg className="w-8 h-8 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-white font-bold text-lg font-display">48-hour sessions</p>
              <p className="text-white/80 text-sm leading-snug">Meetings expire fast &mdash; no more endless polls</p>
            </div>
          </div>
        </motion.section>

        {/* Create Meeting Form Section - matching design Screen 2 */}
        <motion.section
          id="create-meeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="pb-16"
          aria-labelledby="create-meeting-heading"
        >
          <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xl shadow-neutral-900/5 p-8">
            <div className="text-center mb-6">
              <h2 id="create-meeting-heading" className="text-xl font-bold text-neutral-900 tracking-tight font-display">
                New Meeting
              </h2>
              <p className="text-neutral-500 mt-1 text-sm">Get everyone on the same page</p>
            </div>

            <CreateMeetingForm onSubmit={handleCreateMeeting} isLoading={isCreating} />
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-2xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                C
              </div>
              <span className="text-sm font-semibold text-neutral-900 font-display">Convene</span>
            </div>
            <p className="text-xs text-neutral-400">Sessions expire in 48 hours</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
