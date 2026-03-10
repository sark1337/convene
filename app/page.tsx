"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { CreateMeetingForm } from "@/components/CreateMeetingForm";
import { CountdownTimer } from "@/components/CountdownTimer";

// Simulated expiry for demo (47h 32m from now)
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
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header role="banner" className="border-b border-primary/10 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25"
                aria-hidden="true"
              >
                C
              </motion.div>
              <span className="text-2xl font-semibold text-foreground">Convene</span>
            </div>
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
              >
                Features
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" role="main" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4 md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Find the perfect time to meet
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Share a link. Get results in 48 hours. No accounts required.
          </p>

          {/* Demo countdown */}
          <div className="flex justify-center mb-8">
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
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl shadow-primary/5">
            <h2 id="create-meeting-heading" className="text-2xl font-semibold text-center mb-6">
              Create a Meeting
            </h2>
            <CreateMeetingForm onSubmit={handleCreateMeeting} isLoading={isCreating} />
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-20"
          aria-labelledby="features-heading"
        >
          <h2 id="features-heading" className="text-2xl font-semibold text-center mb-12 text-foreground">
            Why Convene?
          </h2>
          <ul className="grid md:grid-cols-3 gap-8 list-none p-0 m-0" role="list">
            {[
              {
                icon: "⏳",
                title: "48-Hour Expiry",
                description:
                  "Sessions auto-expire after 48 hours. Creates urgency, protects privacy, no data clutter.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: "🔥",
                title: "Live Heatmap",
                description:
                  "Real-time availability visualization. See overlapping times instantly as participants respond.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: "📱",
                title: "Mobile-First",
                description:
                  "Touch-optimized 44px cells, horizontal scroll, responsive design. Works everywhere.",
                color: "from-primary to-purple-500",
              },
              {
                icon: "📅",
                title: "Calendar Integration",
                description:
                  "Connect Google Calendar or Outlook. Busy times are pre-blocked automatically.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "✉️",
                title: "Email Confirmation",
                description:
                  "When host picks a time, everyone gets an email with calendar attachment.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: "🔓",
                title: "Zero Friction",
                description:
                  "No accounts needed. Just share a link and gather availability. Simple as that.",
                color: "from-violet-500 to-purple-500",
              },
            ].map((feature, i) => (
              <motion.li
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
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
          className="mt-20"
          aria-labelledby="how-it-works-heading"
        >
          <h2 id="how-it-works-heading" className="text-2xl font-semibold text-center mb-12 text-foreground">
            How it Works
          </h2>
          <ol className="grid md:grid-cols-4 gap-6 list-none p-0 m-0" role="list">
            {[
              { step: "1", title: "Create", description: "Set a date range and time bounds for your meeting." },
              { step: "2", title: "Share", description: "Send the unique link to participants." },
              { step: "3", title: "Gather", description: "Everyone marks when they're free." },
              { step: "4", title: "Confirm", description: "Pick the best time, everyone gets notified." },
            ].map((item, i) => (
              <motion.li
                key={item.step}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-14 h-14 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-lg shadow-primary/25"
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" aria-hidden="true" />
                )}
              </motion.li>
            ))}
          </ol>
        </motion.section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-border mt-20">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold" aria-hidden="true">
                C
              </div>
              <span className="text-lg font-medium text-foreground">Convene</span>
            </div>
            <p className="text-sm text-muted-foreground">
              ⏳ Sessions expire in 48 hours — creating urgency while respecting privacy.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}