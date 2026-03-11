"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Modal } from "@/components/Modal";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="min-h-screen bg-[#09090b]">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#7c3aed] focus:text-white focus:rounded-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header
        role="banner"
        className="sticky top-0 h-[60px] z-50 border-b border-[#1e1e2a]"
        style={{ backgroundColor: "rgba(9, 9, 11, 0.95)" }}
      >
        <div className="mx-auto max-w-6xl px-6 h-full">
          <nav className="flex items-center justify-between h-full">
            <a href="/" className="flex items-center gap-2.5 group">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="h-7 w-7 rounded-lg bg-[#7c3aed] flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">C</span>
              </motion.div>
              <span className="text-[15px] font-bold text-white tracking-tight font-display">
                Convene
              </span>
            </a>
            <div className="flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-[#71717a] hover:text-white text-[14px] transition-colors hidden sm:inline"
              >
                How it works
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-[14px] font-semibold hover:bg-[#6d28d9] transition-colors"
              >
                Create meeting
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main">
        {/* Hero Section - Centered */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 min-h-[calc(100vh-60px)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl mx-auto"
          >
            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium mb-8"
              style={{
                backgroundColor: "rgba(124, 58, 237, 0.12)",
                border: "1px solid rgba(167, 139, 250, 0.3)",
                color: "#a78bfa",
              }}
            >
              Free &middot; No sign-up &middot; 48-hour sessions
            </motion.div>

            {/* Headline */}
            <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-extrabold text-white tracking-tight leading-[1.05] mb-6 font-display">
              Find the time{" "}
              <span className="block">everyone&apos;s free</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] sm:text-[19px] text-[#a1a1aa] leading-relaxed max-w-lg mx-auto mb-10">
              Share a link. Collect availability. Done in 48 hours.
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl
                         bg-[#7c3aed] text-white text-[16px] font-semibold
                         hover:bg-[#6d28d9] transition-colors
                         shadow-primary
                         focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2 focus:ring-offset-[#09090b]"
            >
              Create meeting
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 mt-10"
            >
              <div className="flex items-center -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#111116] flex items-center justify-center text-[#a78bfa] font-bold text-xs font-display ring-2 ring-[#09090b]">S</div>
                <div className="w-8 h-8 rounded-full bg-[#111116] flex items-center justify-center text-[#14b8a6] font-bold text-xs font-display ring-2 ring-[#09090b]">M</div>
                <div className="w-8 h-8 rounded-full bg-[#111116] flex items-center justify-center text-[#f472b6] font-bold text-xs font-display ring-2 ring-[#09090b]">J</div>
              </div>
              <p className="text-[13px] text-[#71717a]">
                <span className="text-white font-semibold">2,400+</span> meetings scheduled this week
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* How it Works */}
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto max-w-6xl px-6 pb-20"
          aria-labelledby="how-it-works-heading"
        >
          <h2 id="how-it-works-heading" className="text-[18px] font-bold text-white tracking-tight mb-6 font-display">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "1", title: "Create a meeting", desc: "Pick a title, date range & time window", color: "bg-[#7c3aed]" },
              { num: "2", title: "Share the link", desc: "Friends tap to mark their free times", color: "bg-[#14b8a6]" },
              { num: "3", title: "Find the match", desc: "Best times auto-ranked -- confirm in one tap", color: "bg-[#f472b6]" },
            ].map((step) => (
              <motion.div
                key={step.num}
                whileHover={{ y: -2 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#111116] border border-[#1e1e2a] transition-all"
              >
                <div className={`w-10 h-10 shrink-0 rounded-lg ${step.color} flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg font-display">{step.num}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-[15px] mb-1">{step.title}</p>
                  <p className="text-[13px] text-[#71717a] leading-snug">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pricing */}
        <motion.section
          id="pricing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mx-auto max-w-6xl px-6 pb-20"
        >
          <div className="rounded-[14px] border border-[#1e1e2a] bg-[#111116] p-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] text-[12px] font-semibold mb-4">
              Free forever
            </div>
            <h2 className="text-[24px] font-bold text-white tracking-tight font-display mb-2">
              No pricing, no limits
            </h2>
            <p className="text-[15px] text-[#71717a] max-w-md mx-auto">
              Create unlimited meetings. Share with anyone. No account required.
            </p>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-[#1e1e2a] bg-[#09090b]">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-[#7c3aed] flex items-center justify-center text-white font-bold text-xs">
                C
              </div>
              <span className="text-[13px] font-semibold text-white font-display">Convene</span>
            </div>
            <p className="text-[11px] text-[#71717a]">Sessions expire in 48 hours</p>
          </div>
        </div>
      </footer>

      {/* Create Meeting Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New meeting"
      >
        <p className="text-[13px] text-[#71717a] mb-5">
          Takes 30 seconds to set up.
        </p>
        <CreateMeetingForm onSubmit={handleCreateMeeting} isLoading={isCreating} />
        <p className="text-center text-[11px] text-[#71717a] mt-5">
          Session expires in 48 hours &middot; No account required
        </p>
      </Modal>
    </div>
  );
}
