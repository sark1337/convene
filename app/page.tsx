"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";
import { CountdownTimer } from "@/components/CountdownTimer";

// Simulated expiry for demo (47h 32m from now)
const DEMO_EXPIRY = addDays(new Date(), 2);

// SVG Icons for features (replacing emoji)
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FireIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A7.975 7.975 0 0120 14a7.975 7.975 0 01-2.343 4.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121a3 3 0 105.242-5.242 3.002 3.002 0 00-5.242 5.242z" />
  </svg>
);

const MobileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UnlockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

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
    <div className="min-h-screen bg-neutral-50">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header role="banner" className="border-b border-neutral-200/50 sticky top-0 bg-white/80 backdrop-blur-xl z-50 supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo with brand */}
            <a href="/" className="group flex items-center gap-3 -ml-2 px-2 py-1 rounded-xl hover:bg-primary-50 transition-colors">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 group-hover:scale-105 transition-all"
                aria-hidden="true"
              >
                <span className="text-white font-bold text-lg tracking-tight">C</span>
              </motion.div>
              <span className="text-xl font-semibold text-neutral-900 tracking-tight">
                Convene
              </span>
            </a>
            
            {/* Navigation with pill style */}
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 p-1 bg-neutral-100 rounded-full">
              <a
                href="#how-it-works"
                className="px-4 py-2 text-sm font-medium text-neutral-600 rounded-full hover:text-neutral-900 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              >
                How it works
              </a>
              <a
                href="#features"
                className="px-4 py-2 text-sm font-medium text-neutral-600 rounded-full hover:text-neutral-900 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
              >
                Features
              </a>
            </nav>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" role="main" className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-8 md:pt-12"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            No signup required
          </motion.div>
          
          {/* Headline - strong, no gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-neutral-900">Find the </span>
            <span className="text-primary-500">perfect time</span>
            <span className="text-neutral-900"> to meet</span>
          </h1>
          
          {/* Subtitle with emphasis */}
          <p className="text-lg md:text-xl text-neutral-600 max-w-xl mx-auto leading-relaxed mb-6">
            <span className="text-neutral-900 font-medium">Share a link.</span> Get results in
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-semibold"> 48 hours</span>. 
            No accounts required.
          </p>

          {/* Demo countdown */}
          <div className="flex justify-center">
            <CountdownTimer expiresAt={DEMO_EXPIRY} />
          </div>
        </motion.div>

        {/* Create Meeting Form */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-md mx-auto"
          aria-labelledby="create-meeting-heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            {/* Decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 via-primary-500 to-purple-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
            
            <div className="relative bg-white rounded-2xl border border-neutral-200/80 shadow-2xl shadow-neutral-900/5 p-8 md:p-10">
              {/* Header with illustration */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 mb-4">
                  <CalendarIcon className="w-7 h-7 text-white" />
                </div>
                <h2 id="create-meeting-heading" className="text-2xl font-bold tracking-tight text-neutral-900">
                  Schedule your meeting
                </h2>
                <p className="text-neutral-500 mt-1">Get everyone on the same page</p>
              </div>
              
              <CreateMeetingForm onSubmit={handleCreateMeeting} isLoading={isCreating} />
            </div>
          </motion.div>
        </motion.section>

        {/* Features */}
        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-24"
          aria-labelledby="features-heading"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl font-bold tracking-tight text-neutral-900 mb-3">
              Why choose Convene?
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto">
              Everything you need to coordinate schedules, nothing you don&apos;t.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0" role="list">
            {[
              {
                Icon: ClockIcon,
                title: "48-Hour Expiry",
                description: "Sessions auto-expire after 48 hours. Creates urgency, protects privacy, no data clutter.",
                iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
              },
              {
                Icon: FireIcon,
                title: "Live Heatmap",
                description: "Real-time availability visualization. See overlapping times instantly as participants respond.",
                iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
              },
              {
                Icon: MobileIcon,
                title: "Mobile-First",
                description: "Touch-optimized 44px cells, horizontal scroll, responsive design. Works everywhere.",
                iconBg: "bg-gradient-to-br from-primary-500 to-purple-500",
              },
              {
                Icon: CalendarIcon,
                title: "Calendar Integration",
                description: "Connect Google Calendar or Outlook. Busy times are pre-blocked automatically.",
                iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
              },
              {
                Icon: MailIcon,
                title: "Email Confirmation",
                description: "When host picks a time, everyone gets an email with calendar attachment.",
                iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
              },
              {
                Icon: UnlockIcon,
                title: "Zero Friction",
                description: "No accounts needed. Just share a link and gather availability. Simple as that.",
                iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
              },
            ].map((feature, i) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm hover:shadow-lg hover:border-primary-200/50 transition-all duration-300"
              >
                {/* Icon container */}
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <feature.Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* How it works */}
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-24"
          aria-labelledby="how-it-works-heading"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 id="how-it-works-heading" className="text-3xl font-bold tracking-tight text-neutral-900 mb-3">
              How it Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto">
              Simple, fast, and frustration-free scheduling.
            </p>
          </div>

          <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 list-none p-0 m-0" role="list">
            {[
              { step: "1", title: "Create", description: "Set a date range and time bounds for your meeting." },
              { step: "2", title: "Share", description: "Send the unique link to participants." },
              { step: "3", title: "Gather", description: "Everyone marks when they&apos;re free." },
              { step: "4", title: "Confirm", description: "Pick the best time, everyone gets notified." },
            ].map((item, i) => (
              <motion.li
                key={item.step}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
                  <div 
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white text-xl font-bold flex items-center justify-center mb-4 shadow-lg shadow-primary-500/25"
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-[52px] left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-200 to-transparent" aria-hidden="true" />
                )}
              </motion.li>
            ))}
          </ol>
        </motion.section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-neutral-200 mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/25" aria-hidden="true">
                C
              </div>
              <span className="text-lg font-semibold text-neutral-900">Convene</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <ClockIcon className="w-4 h-4 text-amber-500" />
              <span>Sessions expire in 48 hours — creating urgency while respecting privacy.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}