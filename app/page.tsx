"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";

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
    <div className="min-h-screen bg-[#09090b]">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#7c3aed] focus:text-white focus:rounded-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Header - Sticky nav */}
      <header 
        role="banner" 
        className="sticky top-0 h-[60px] z-50 border-b border-[#1e1e2a]"
        style={{ backgroundColor: 'rgba(9, 9, 11, 0.95)' }}
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
                className="text-[#71717a] hover:text-white text-[14px] transition-colors"
              >
                How it works
              </a>
              <a 
                href="#pricing" 
                className="text-[#71717a] hover:text-white text-[14px] transition-colors"
              >
                Pricing
              </a>
              <a
                href="#create-meeting"
                className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-[14px] font-semibold hover:bg-[#6d28d9] transition-colors"
              >
                Create meeting
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main" className="mx-auto max-w-6xl px-6">
        {/* Hero Section - Two column layout */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-20 lg:py-[80px]"
        >
          <div className="flex flex-col lg:flex-row gap-20 lg:gap-[80px]">
            {/* Left Column */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Tag/Pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium mb-6 w-fit"
                style={{ 
                  backgroundColor: 'rgba(124, 58, 237, 0.12)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  color: '#a78bfa'
                }}
              >
                Fast · Free · No sign-up
              </motion.div>

              {/* Headline */}
              <h1 className="text-[40px] sm:text-[52px] font-extrabold text-white tracking-tight leading-[1.1] mb-5 font-display max-w-[460px]">
                Find time to{" "}
                <span className="block">meet, fast</span>
              </h1>

              {/* Subtitle */}
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed max-w-md mb-8">
                Share a link. Participants mark their availability. Convene finds the best time. Done in 48 hours.
              </p>

              {/* Avatar stack with social proof */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center -space-x-2">
                  <div className="w-9 h-9 rounded-full bg-[#111116] flex items-center justify-center text-[#a78bfa] font-bold text-sm font-display ring-2 ring-[#09090b]">S</div>
                  <div className="w-9 h-9 rounded-full bg-[#111116] flex items-center justify-center text-[#14b8a6] font-bold text-sm font-display ring-2 ring-[#09090b]">M</div>
                  <div className="w-9 h-9 rounded-full bg-[#111116] flex items-center justify-center text-[#f472b6] font-bold text-sm font-display ring-2 ring-[#09090b]">J</div>
                  <div className="w-9 h-9 rounded-full bg-[#111116] flex items-center justify-center text-[#7c3aed] font-bold text-sm font-display ring-2 ring-[#09090b]">+</div>
                </div>
                <p className="text-[13px] text-[#71717a]">
                  <span className="text-white font-semibold">2,400+</span> meetings scheduled this week
                </p>
              </motion.div>
            </div>

            {/* Right Column - Form Card */}
            <motion.div
              id="create-meeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-1 max-w-md"
            >
              <div 
                className="rounded-[14px] border p-6"
                style={{ 
                  backgroundColor: '#111116',
                  borderColor: '#1e1e2a'
                }}
              >
                <div className="mb-5">
                  <h2 className="text-[18px] font-bold text-white tracking-tight font-display">
                    New meeting
                  </h2>
                  <p className="text-[13px] text-[#71717a] mt-1">
                    Takes 30 seconds to set up.
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#1e1e2a] mb-5" />

                <CreateMeetingForm onSubmit={handleCreateMeeting} isLoading={isCreating} />

                {/* Footer text */}
                <p className="text-center text-[11px] text-[#71717a] mt-5">
                  Session expires in 48 hours · No account required
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* How it Works */}
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pb-16"
          aria-labelledby="how-it-works-heading"
        >
          <h2 id="how-it-works-heading" className="text-[18px] font-bold text-white tracking-tight mb-6 font-display">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "1", title: "Create a meeting", desc: "Pick a title, date range & time window", color: "bg-[#7c3aed]" },
              { num: "2", title: "Share the link", desc: "Friends tap to mark their free times", color: "bg-[#14b8a6]" },
              { num: "3", title: "Find the match", desc: "Best times auto-ranked — confirm in one tap", color: "bg-[#f472b6]" },
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

        {/* Pricing section placeholder */}
        <motion.section
          id="pricing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-20"
        >
          <div className="rounded-[14px] border border-[#1e1e2a] bg-[#111116] p-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c3aed]/20 text-[#a78bfa] text-[12px] font-semibold mb-4">
              <span>✨</span> Free forever
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
    </div>
  );
}