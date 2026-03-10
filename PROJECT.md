# Convene — Product Plan

## Vision
Lightweight meeting availability planner. Zero-friction group scheduling with 48-hour expiry.

## Core Differentiators
- **48-Hour Expiring Sessions** — Creates urgency, auto-cleans data, privacy-friendly
- **Google Calendar Auto-fill** — Optional OAuth, pre-block busy times
- **Live Heatmap** — Real-time WebSocket updates
- **Mobile-First** — Touch-friendly 44px cells, horizontal scroll
- **Zero Friction** — No accounts required

## Tech Stack
- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS, Framer Motion, date-fns
- **Backend:** Next.js API Routes, Upstash Redis (48h TTL), Supabase Realtime
- **Email:** Resend + React Email
- **Hosting:** Vercel (convene.scoutos.live)

## Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #5B4FE8 | Buttons, links, accent |
| Background | #FAFAFA | Page background |
| Heatmap 0 | #F3F4F6 | No availability |
| Heatmap Full | #10B981 | Everyone available |
| Urgent | #F59E0B | Countdown <12h |
| Critical | #EF4444 | Countdown <1h |

## Build Phases

### Phase 1: Project Scaffold ✓
**Goal:** Next.js 14 + TypeScript + Tailwind, deploy to Vercel
**Success:** `npm run dev` works, page renders at localhost:3000

### Phase 2: Data Models + Redis Schema
**Goal:** Meeting, participants, availability slots with 48h TTL
**Success:** Can create/retrieve meeting from Redis

### Phase 3: Create Meeting Page
**Goal:** Landing page with title, email, date range, time range inputs
**Success:** Form submits, generates shareable URL

### Phase 4: Availability Grid + Drag-Select
**Goal:** Interactive time grid with mouse/touch drag support
**Success:** Can drag to select/unselect time slots

### Phase 5: 48-Hour Countdown Timer
**Goal:** Visible expiry countdown, color changes approaching deadline
**Success:** Timer shows, colors transition correctly

### Phase 6: Host Finalize + Email Confirmation
**Goal:** Host picks time, Resend fires confirmation email with .ics
**Success:** Email sent with calendar attachment

### Phase 7: Live Heatmap Visualization
**Goal:** Color gradient overlay, real-time Supabase WebSocket updates
**Success:** Grid updates live across clients

### Phase 8: Best Times Summary
**Goal:** Auto-compute and display top slots where most are free
**Success:** Shows ranked availability slots

### Phase 9: Participant List + Response Tracking
**Goal:** Show who responded (checkmark) and who is pending
**Success:** Participant list with status indicators

### Phase 10: Mobile Polish
**Goal:** Horizontal scroll, sticky time column, 44px touch targets
**Success:** Works smoothly on mobile

### Phase 11: Google Calendar OAuth
**Goal:** Client-side OAuth, freebusy scope, auto-block busy times
**Success:** Can connect Google Calendar, see blocked times

### Phase 12: Outlook/Office 365 Integration
**Goal:** Microsoft Graph API, same pattern as Google
**Success:** Can connect Outlook calendar

### Phase 13: iCal URL Fallback
**Goal:** Paste iCal URL, parse and pre-fill availability
**Success:** Can import iCal URL

### Phase 14: Google Calendar Verification
**Goal:** Submit for Google review (freebusy scope)
**Success:** App approved

### Phase 15: Timezone Intelligence
**Goal:** Auto-detect, display in participant's local timezone
**Success:** Times show in correct timezone

### Phase 16: Accessibility Audit
**Goal:** Keyboard nav, ARIA labels, WCAG AA contrast
**Success:** Passes accessibility audit

### Phase 17: QR Code Sharing
**Goal:** Generate QR code for meeting URL
**Success:** QR code renders correctly

### Phase 18: Launch
**Goal:** Production deploy at convene.scoutos.live
**Success:** All flows work end-to-end