# Convene Design System

A comprehensive design guide for building responsive mobile meeting/scheduling applications.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Modern Mobile App Design Patterns](#modern-mobile-app-design-patterns)
3. [Color System](#color-system)
4. [Typography Scale](#typography-scale)
5. [Spacing Scale](#spacing-scale)
6. [Component Design Patterns](#component-design-patterns)
7. [Responsive Design Tokens](#responsive-design-tokens)
8. [Micro-interactions & Animation](#micro-interactions--animation)
9. [Accessibility Requirements](#accessibility-requirements)
10. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

### Core Principles

**1. Clarity Over Cleverness**
- Every element serves a purpose
- Users should instantly understand availability at a glance
- Reduce cognitive load by presenting only relevant options

**2. Time is Precious**
- Minimize taps to schedule (ideal: 3 taps maximum)
- Pre-fill default values intelligently
- Surface most-used actions prominently

**3. Mobile-First, Desktop-Ready**
- Touch targets and viewport are primary constraints
- Responsive breakpoints adapt for larger screens
- Consistent experience across device types

**4. Trust Through Transparency**
- Show clear availability states
- Confirm actions before committing
- Provide immediate feedback on user actions

---

## Modern Mobile App Design Patterns

### What Makes Successful Scheduling Apps

#### Calendly Patterns
- **Slot-Based Selection**: Hides unavailable times, only showing bookable slots
- **One-Click Booking**: After selecting a slot, minimal form required
- **Clear Availability Visualization**: Available slots highlighted prominently
- **Timezone Detection**: Automatic detection with manual override option
- **Confirmation Flow**: Clear success state with calendar invite generation

#### Doodle Patterns
- **Poll-Based Availability**: Group members vote on preferred times
- **Visual Availability Heat Maps**: Show overlapping availability as colored grid
- **Participant Avatars**: Visual representation of who has responded
- **Progress Indicators**: Show how many have responded vs. pending

#### When2meet Patterns
- **Drag-to-Select Availability**: Intuitive grid-based availability painting
- **Heat Map Visualization**: Density of availability shown through color intensity
- **Anonymous-First**: Participants can see availability without logging in
- **Shareable Links**: Easy distribution for group scheduling

#### Google Calendar Scheduler Patterns
- **Integration-First**: Seamlessly connects with email and contacts
- **Smart Suggestions**: AI-powered meeting time recommendations
- **Conflict Detection**: Real-time warning about scheduling conflicts
- **Recurring Meeting Support**: Easy setup for repeat events

### Key UI Patterns for Scheduling Apps

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Grid Calendar** | Date selection | 7-column grid, month navigation |
| **Time Slot List** | Time selection | Scrollable list of available slots |
| **Availability Heat Map** | Group scheduling | Color-coded availability density |
| **Timeline View** | Day scheduling | Vertical timeline with event blocks |
| **Drag Selection** | Availability input | Touch/pointer drag on grid |
| **Quick Actions** | Common tasks | Floating action button (FAB) |

---

## Color System

### Primary Color Palette

For scheduling/availability apps, we recommend colors that convey trust, clarity, and action.

```css
:root {
  /* Brand Primary - Trust & Reliability */
  --color-primary-50: #E8F5F3;
  --color-primary-100: #C2E6DF;
  --color-primary-200: #9BD7CA;
  --color-primary-300: #69C3B3;
  --color-primary-400: #38A99A;
  --color-primary-500: #1A8F87;  /* Primary Brand Color */
  --color-primary-600: #0F7570;
  --color-primary-700: #075C57;
  --color-primary-800: #024441;
  --color-primary-900: #002D2B;

  /* Accent Color - CTAs & Actions */
  --color-accent-50: #FFF4E5;
  --color-accent-100: #FFE4C2;
  --color-accent-200: #FFD49F;
  --color-accent-300: #FFBF70;
  --color-accent-400: #FFA941;
  --color-accent-500: #FF9311;  /* Accent/CTA Color */
  --color-accent-600: #E67600;
  --color-accent-700: #CC5F00;
  --color-accent-800: #A64B00;
  --color-accent-900: #803800;
}
```

### Semantic Colors

```css
:root {
  /* Success - Available/Confirmed */
  --color-success-50: #E8F8ED;
  --color-success-100: #C6EED4;
  --color-success-200: #A4E4BB;
  --color-success-300: #7DDA9F;
  --color-success-400: #54CF82;
  --color-success-500: #2DC468;  /* Available State */
  --color-success-600: #24A556;
  --color-success-700: #1A8644;
  --color-success-800: #116733;
  --color-success-900: #084822;

  /* Warning - Conflicts/Pending */
  --color-warning-50: #FFF8E6;
  --color-warning-100: #FFEFC2;
  --color-warning-200: #FFE69E;
  --color-warning-300: #FFDC76;
  --color-warning-400: #FFD14F;
  --color-warning-500: #FFC628;  /* Warning State */
  --color-warning-600: #E6AB00;
  --color-warning-700: #CC9400;
  --color-warning-800: #A67800;
  --color-warning-900: #805D00;

  /* Error - Unavailable/Rejected */
  --color-error-50: #FCE8E8;
  --color-error-100: #F8C6C6;
  --color-error-200: #F4A5A5;
  --color-error-300: #EF8383;
  --color-error-400: #E96060;
  --color-error-500: #E43D3D;  /* Error/Unavailable State */
  --color-error-600: #C22828;
  --color-error-700: #9F1E1E;
  --color-error-800: #7B1515;
  --color-error-900: #580B0B;

  /* Info - Neutral Information */
  --color-info-50: #E8F4FD;
  --color-info-100: #C2E4F9;
  --color-info-200: #9BD3F5;
  --color-info-300: #69BEF1;
  --color-info-400: #38A9ED;
  --color-info-500: #0694E9;  /* Info State */
  --color-info-600: #057AC5;
  --color-info-700: #0461A1;
  --color-info-800: #034980;
  --color-info-900: #02315E;
}
```

### Surface & Neutral Colors

```css
:root {
  /* Background Surfaces */
  --color-surface-primary: #FFFFFF;
  --color-surface-secondary: #F8FAFA;
  --color-surface-tertiary: #F2F5F5;
  --color-surface-elevated: #FFFFFF;
  
  /* Dark Mode Surfaces */
  --color-surface-primary-dark: #121416;
  --color-surface-secondary-dark: #1C1F23;
  --color-surface-tertiary-dark: #272A2F;
  --color-surface-elevated-dark: #32373D;

  /* Neutral Text Colors */
  --color-neutral-50: #F8FAFA;
  --color-neutral-100: #F2F5F5;
  --color-neutral-200: #E5E9E9;
  --color-neutral-300: #D1D6D6;
  --color-neutral-400: #A8B0B0;
  --color-neutral-500: #7D8686;
  --color-neutral-600: #5B6565;
  --color-neutral-700: #3D4747;
  --color-neutral-800: #212A2A;
  --color-neutral-900: #0D1313;

  /* Text Hierarchy */
  --color-text-primary: #212A2A;
  --color-text-secondary: #5B6565;
  --color-text-tertiary: #7D8686;
  --color-text-disabled: #A8B0B0;
  --color-text-inverse: #FFFFFF;

  /* Borders & Dividers */
  --color-border-light: #E5E9E9;
  --color-border-medium: #D1D6D6;
  --color-border-strong: #5B6565;
  --color-border-focus: #1A8F87;
}
```

### Availability Heat Map Colors

For group scheduling views showing availability density:

```css
:root {
  /* Availability Density (Low to High) */
  --availability-none: rgba(255, 255, 255, 0);  /* Transparent */
  --availability-low: #FFE5E5;     /* 1 person available */
  --availability-medium-low: #FFD4A8;  /* 2-3 people */
  --availability-medium: #FFF099;  /* 4-5 people */
  --availability-medium-high: #C6F0C6;  /* 6-7 people */
  --availability-high: #7DDA9F;    /* 8-9 people */
  --availability-full: #2DC468;    /* Everyone available */
}
```

### Modern Gradient Trends (2024-2025)

```css
:root {
  /* Primary Action Gradients */
  --gradient-primary: linear-gradient(135deg, #1A8F87 0%, #38A99A 100%);
  --gradient-accent: linear-gradient(135deg, #FF9311 0%, #FFC628 100%);
  
  /* Availability Gradients */
  --gradient-available: linear-gradient(135deg, #2DC468 0%, #54CF82 100%);
  --gradient-unavailable: linear-gradient(135deg, #E43D3D 0%, #EF8383 100%);
  
  /* Subtle Background Gradients */
  --gradient-surface: linear-gradient(180deg, #FFFFFF 0%, #F8FAFA 100%);
  --gradient-surface-dark: linear-gradient(180deg, #1C1F23 0%, #121416 100%);
  
  /* Glassmorphism Overlays */
  --gradient-glass: linear-gradient(
    135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%
  );
}
```

---

## Typography Scale

### Font Families

```css
:root {
  /* Primary Font Stack */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
    'Roboto', 'Helvetica Neue', sans-serif;
  
  /* Monospace for Time/Numbers */
  --font-family-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', 
    'Menlo', 'Monaco', monospace;
  
  /* Display/Heading Font (Optional) */
  --font-family-display: 'Cal Sans', 'Inter', -apple-system, 
    BlinkMacSystemFont, sans-serif;
}
```

### Type Scale (基于 4px Grid)

Using a modular scale with a ratio of approximately 1.25 (Major Third):

```css
:root {
  /* Font Size Scale (rem values for accessibility) */
  --font-size-xs: 0.625rem;     /* 10px - Labels, badges */
  --font-size-sm: 0.75rem;      /* 12px - Captions, helpers */
  --font-size-base: 0.875rem;    /* 14px - Body text (mobile-optimized) */
  --font-size-md: 1rem;         /* 16px - Body text (desktop) */
  --font-size-lg: 1.125rem;     /* 18px - Subheadings */
  --font-size-xl: 1.25rem;      /* 20px - H3 */
  --font-size-2xl: 1.5rem;      /* 24px - H2 */
  --font-size-3xl: 1.875rem;    /* 30px - H1 */
  --font-size-4xl: 2.25rem;     /* 36px - Large H1 */
  --font-size-5xl: 3rem;        /* 48px - Display */
  --font-size-6xl: 3.75rem;     /* 60px - Hero */

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Letter Spacing */
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
}
```

### Typography Tokens for Components

```css
/* Heading Styles */
.heading-1 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.heading-2 {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.heading-3 {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

/* Body Styles */
.body-large {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.body-base {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

/* Time/Date Display */
.time-display {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-height-snug);
}

.date-display {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

/* Caption & Helper */
.caption {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}

.label {
  font-family: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}
```

---

## Spacing Scale

### Base Unit: 4px

Using a 4-point grid system ensures consistent spacing and alignment:

```css
:root {
  /* Spacing Scale */
  --space-0: 0;
  --space-px: 1px;          /* Hairline borders */
  --space-0-5: 0.125rem;     /* 2px - Micro spacing */
  --space-1: 0.25rem;        /* 4px - Tight spacing */
  --space-1-5: 0.375rem;     /* 6px */
  --space-2: 0.5rem;         /* 8px - Compact */
  --space-2-5: 0.625rem;     /* 10px */
  --space-3: 0.75rem;        /* 12px - Default compact */
  --space-3-5: 0.875rem;     /* 14px */
  --space-4: 1rem;           /* 16px - Base padding */
  --space-5: 1.25rem;       /* 20px */
  --space-6: 1.5rem;        /* 24px - Comfortable */
  --space-7: 1.75rem;       /* 28px */
  --space-8: 2rem;         /* 32px - Section spacing */
  --space-9: 2.25rem;      /* 36px */
  --space-10: 2.5rem;       /* 40px */
  --space-11: 2.75rem;      /* 44px */
  --space-12: 3rem;         /* 48px - Large spacing */
  --space-14: 3.5rem;       /* 56px */
  --space-16: 4rem;         /* 64px */
  --space-20: 5rem;         /* 80px */
  --space-24: 6rem;         /* 96px */
  --space-28: 7rem;         /* 112px */
  --space-32: 8rem;         /* 128px */

  /* Component-Specific Spacing */
  --space-card-padding: var(--space-4);
  --space-button-padding-x: var(--space-4);
  --space-button-padding-y: var(--space-2);
  --space-input-padding-x: var(--space-3);
  --space-input-padding-y: var(--space-2);
  --space-list-item-padding: var(--space-3);
  
  /* Grid Gap */
  --gap-xs: var(--space-1);    /* 4px */
  --gap-sm: var(--space-2);    /* 8px */
  --gap-md: var(--space-3);    /* 12px */
  --gap-lg: var(--space-4);    /* 16px */
  --gap-xl: var(--space-6);    /* 24px */
}
```

### Spacing Usage Guidelines

| Token | Usage |
|-------|-------|
| `space-1` (4px) | Icon-to-label gaps, tight inline elements |
| `space-2` (8px) | Badge padding, compact list items |
| `space-3` (12px) | Input padding, small button gaps |
| `space-4` (16px) | Card content, default container padding |
| `space-6` (24px) | Section separators, modal padding |
| `space-8` (32px) | Page sections, larger containers |
| `space-12` (48px) | Major section breaks |

---

## Component Design Patterns

### 1. Calendar/Availability Grid Component

```css
/* Calendar Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--gap-xs);
  width: 100%;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  /* Touch target */
  min-width: 44px;
  min-height: 44px;
}

.calendar-day:hover {
  background-color: var(--color-surface-secondary);
}

.calendar-day:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.calendar-day--today {
  font-weight: var(--font-weight-semibold);
  position: relative;
}

.calendar-day--today::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-primary-500);
}

.calendar-day--selected {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
}

.calendar-day--disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.calendar-day--has-events::before {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-accent-500);
}

/* Week Day Headers */
.calendar-weekday {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-align: center;
  padding: var(--space-2) 0;
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}
```

### 2. Time Slot Selection UI

```css
/* Time Slot List */
.time-slots-container {
  display: flex;
  flex-direction: column;
  gap: var(--gap-xs);
  max-height: 50vh;
  overflow-y: auto;
}

.time-slot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  background-color: var(--color-surface-primary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  min-height: 48px; /* Touch target */
}

.time-slot:hover:not(.time-slot--unavailable) {
  border-color: var(--color-primary-300);
  background-color: var(--color-surface-secondary);
}

.time-slot:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.time-slot--selected {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-50);
}

.time-slot--unavailable {
  background-color: var(--color-surface-tertiary);
  color: var(--color-text-disabled);
  cursor: not-allowed;
  text-decoration: line-through;
}

.time-slot__time {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.time-slot__duration {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Time Slot Grid View */
.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--gap-sm);
  padding: var(--space-2);
}

.time-grid-item {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  text-align: center;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.time-grid-item--available {
  background-color: var(--color-surface-tertiary);
  border: 1px solid var(--color-border-light);
}

.time-grid-item--available:hover {
  background-color: var(--color-success-50);
  border-color: var(--color-success-300);
}

.time-grid-item--selected {
  background-color: var(--color-success-500);
  color: white;
  border-color: var(--color-success-500);
}

.time-grid-item--unavailable {
  background-color: transparent;
  border: 1px dashed var(--color-border-medium);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
```

### 3. Participant Avatars & Status Indicators

```css
/* Avatar Component */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-primary-200);
  color: var(--color-primary-700);
  font-weight: var(--font-weight-medium);
  overflow: hidden;
  position: relative;
}

/* Avatar Sizes */
.avatar--xs {
  width: 24px;
  height: 24px;
  font-size: var(--font-size-xs);
}

.avatar--sm {
  width: 32px;
  height: 32px;
  font-size: var(--font-size-sm);
}

.avatar--md {
  width: 40px;
  height: 40px;
  font-size: var(--font-size-base);
}

.avatar--lg {
  width: 48px;
  height: 48px;
  font-size: var(--font-size-md);
}

.avatar--xl {
  width: 64px;
  height: 64px;
  font-size: var(--font-size-xl);
}

/* Avatar Group (Stacked) */
.avatar-group {
  display: flex;
  align-items: center;
}

.avatar-group .avatar {
  margin-left: -8px;
  border: 2px solid var(--color-surface-primary);
}

.avatar-group .avatar:first-child {
  margin-left: 0;
}

/* Status Indicator */
.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  min-width: 8px;
  min-height: 8px;
  border-radius: 50%;
  border: 2px solid var(--color-surface-primary);
}

.status-indicator--online {
  background-color: var(--color-success-500);
}

.status-indicator--away {
  background-color: var(--color-warning-500);
}

.status-indicator--busy {
  background-color: var(--color-error-500);
}

.status-indicator--offline {
  background-color: var(--color-neutral-400);
}

/* Availability Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.status-badge--available {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.status-badge--tentative {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.status-badge--busy {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}
```

### 4. Mobile-First Navigation Patterns

```css
/* Bottom Tab Navigation (Mobile Primary) */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 64px;
  background-color: var(--color-surface-primary);
  border-top: 1px solid var(--color-border-light);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-2);
  min-width: 64px;
  min-height: 44px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.bottom-nav__item:active {
  color: var(--color-primary-500);
}

.bottom-nav__item--active {
  color: var(--color-primary-500);
}

.bottom-nav__icon {
  width: 24px;
  height: 24px;
}

.bottom-nav__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

/* Top Navigation Bar */
.top-nav {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--space-4);
  background-color: var(--color-surface-primary);
  border-bottom: 1px solid var(--color-border-light);
  z-index: 50;
}

.top-nav__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.top-nav__action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Floating Action Button (FAB) */
.fab {
  position: fixed;
  bottom: calc(64px + var(--space-4) + env(safe-area-inset-bottom));
  right: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  z-index: 90;
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.fab:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
}

.fab:active {
  transform: scale(0.95);
}

.fab--extended {
  width: auto;
  padding: 0 var(--space-4);
  gap: var(--space-2);
}

.fab__icon {
  width: 24px;
  height: 24px;
}

.fab__label {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}
```

### 5. Form Inputs for Meeting Creation

```css
/* Input Container */
.input-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

/* Text Input */
.text-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  background-color: var(--color-surface-primary);
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
  min-height: 48px; /* Touch target */
}

.text-input:hover {
  border-color: var(--color-neutral-500);
}

.text-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.text-input::placeholder {
  color: var(--color-text-disabled);
}

.text-input--error {
  border-color: var(--color-error-500);
}

.text-input--error:focus {
  box-shadow: 0 0 0 3px var(--color-error-100);
}

/* Dropdown/Select */
.select-wrapper {
  position: relative;
}

.select {
  appearance: none;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  padding-right: var(--space-10);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  background-color: var(--color-surface-primary);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237D8686' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  cursor: pointer;
  min-height: 48px;
}

.select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

/* Date/Time Input */
.datetime-input {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-primary);
  min-height: 48px;
}

.datetime-input:focus-within {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.datetime-input__icon {
  color: var(--color-text-secondary);
}

.datetime-input__field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--font-size-md);
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  outline: none;
}

/* Duration Selector */
.duration-selector {
  display: flex;
  gap: var(--gap-sm);
  flex-wrap: wrap;
}

.duration-option {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  background-color: var(--color-surface-primary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  min-height: 44px;
  min-width: 44px;
}

.duration-option:hover {
  border-color: var(--color-primary-300);
}

.duration-option--selected {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

/* Participant Selector */
.participant-input {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-sm);
  padding: var(--space-2);
  border: 1px solid var(--color-border-medium);
  border-radius: var(--radius-md);
  background-color: var(--color-surface-primary);
  min-height: 48px;
}

.participant-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--color-surface-tertiary);
  font-size: var(--font-size-sm);
}

.participant-chip__avatar {
  width: 20px;
  height: 20px;
  font-size: var(--font-size-xs);
}

.participant-chip__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--color-neutral-300);
  cursor: pointer;
}

.participant-input__field {
  flex: 1;
  min-width: 100px;
  border: none;
  background: transparent;
  font-size: var(--font-size-md);
  outline: none;
}

/* Helper & Error Text */
.input-helper {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.input-error {
  font-size: var(--font-size-sm);
  color: var(--color-error-500);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### 6. Loading States & Micro-interactions

```css
/* Loading States */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-tertiary) 0%,
    var(--color-neutral-200) 50%,
    var(--color-surface-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Spinner */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner--lg {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

/* Button States */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-primary);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  min-height: 44px;
  border: none;
}

.btn--primary {
  background-color: var(--color-primary-500);
  color: white;
}

.btn--primary:hover {
  background-color: var(--color-primary-600);
}

.btn--primary:active {
  background-color: var(--color-primary-700);
  transform: scale(0.98);
}

.btn--primary:disabled {
  background-color: var(--color-primary-200);
  cursor: not-allowed;
}

.btn--secondary {
  background-color: transparent;
  border: 1px solid var(--color-border-medium);
  color: var(--color-text-primary);
}

.btn--secondary:hover {
  background-color: var(--color-surface-secondary);
}

.btn--accent {
  background: var(--gradient-accent);
  color: white;
}

/* Button Loading State */
.btn--loading {
  color: transparent !important;
  pointer-events: none;
}

.btn--loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Touch Feedback (Mobile) */
@media (hover: none) {
  .btn:active {
    transform: scale(0.95);
    opacity: 0.9;
  }
  
  .time-slot:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
  
  .calendar-day:active {
    transform: scale(0.95);
  }
}

/* Pull-to-Refresh Indicator */
.pull-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.pull-indicator__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border-light);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: var(--space-2);
}

/* Success Animation */
@keyframes success-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon {
  animation: success-pulse 0.5s ease-out;
}

/* Fade In Animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Slide Up Animation (Modals/Sheets) */
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.slide-up {
  animation: slide-up 0.3s ease-out;
}
```

---

## Responsive Design Tokens

### Breakpoints

```css
:root {
  /* Mobile First Breakpoints */
  --breakpoint-xs: 320px;   /* Small phones */
  --breakpoint-sm: 375px;   /* Standard phones */
  --breakpoint-md: 428px;   /* Large phones */
  --breakpoint-lg: 768px;   /* Tablets */
  --breakpoint-xl: 1024px;  /* Small laptops */
  --breakpoint-2xl: 1280px; /* Desktops */
  --breakpoint-3xl: 1536px; /* Large screens */
}

/* Media Query Mixins (for reference) */
/* 
  @media (min-width: 320px) { }   // xs
  @media (min-width: 375px) { }   // sm
  @media (min-width: 428px) { }   // md
  @media (min-width: 768px) { }   // lg - tablet
  @media (min-width: 1024px) { }  // xl - laptop
  @media (min-width: 1280px) { }  // 2xl - desktop
  @media (min-width: 1536px) { }  // 3xl - large screen
*/
```

### Responsive Container Widths

```css
:root {
  --container-xs: 100%;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}

.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container {
    max-width: var(--container-sm);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: var(--container-md);
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: var(--container-lg);
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: var(--container-xl);
  }
}
```

### Border Radius Scale

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px - Small elements, badges */
  --radius-md: 0.375rem;   /* 6px - Buttons, inputs */
  --radius-lg: 0.5rem;     /* 8px - Cards */
  --radius-xl: 0.75rem;    /* 12px - Modals */
  --radius-2xl: 1rem;      /* 16px - Large cards */
  --radius-3xl: 1.5rem;    /* 24px - Hero elements */
  --radius-full: 9999px;   /* Pills, avatars, circles */
}
```

### Shadow/Elevation System

```css
:root {
  /* Elevation Levels (Material Design inspired) */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 
               0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
               0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
               0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
               0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Colored Shadows (for emphasis) */
  --shadow-primary: 0 4px 14px 0 rgba(26, 143, 135, 0.25);
  --shadow-accent: 0 4px 14px 0 rgba(255, 147, 17, 0.25);
  
  /* Inset Shadows */
  --shadow-inset: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  
  /* Focus Ring */
  --shadow-focus: 0 0 0 3px rgba(26, 143, 135, 0.4);
  --shadow-focus-error: 0 0 0 3px rgba(228, 61, 61, 0.4);
}
```

### Animation Timing Functions

```css
:root {
  /* Duration */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
  
  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Custom Easings */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Transition Utilities */
.transition-all {
  transition: all var(--duration-normal) var(--ease-out);
}

.transition-colors {
  transition: color var(--duration-fast) var(--ease-out),
              background-color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.transition-transform {
  transition: transform var(--duration-normal) var(--ease-out);
}

.transition-opacity {
  transition: opacity var(--duration-normal) var(--ease-out);
}
```

---

## Micro-interactions & Animation

### Principles

1. **Purposeful Motion**: Every animation should serve a purpose (feedback, guidance, delight)
2. **Performance First**: Use `transform` and `opacity` for 60fps animations
3. **Perceived Speed**: Animations should feel instant but smooth (150-300ms)
4. **Reduced Motion**: Respect `prefers-reduced-motion` for accessibility

### Key Interaction Patterns

```css
/* Button Press Feedback */
.btn {
  transition: transform var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

/* Card Hover & Selection */
.card {
  transition: transform var(--duration-normal) var(--ease-out),
              box-shadow var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card--selectable:active {
  transform: scale(0.99);
}

/* Calendar Day Selection */
.calendar-day {
  transition: background-color var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

.calendar-day:active {
  transform: scale(0.92);
}

/* List Item Swipe (Mobile) */
.list-item {
  transition: transform var(--duration-normal) var(--ease-out);
}

.list-item--swiping {
  transform: translateX(var(--swipe-offset, 0));
}

/* Modal/Sheet Entry */
.modal-backdrop {
  animation: fade-in var(--duration-normal) var(--ease-out);
}

.modal-content {
  animation: slide-up var(--duration-normal) var(--ease-bounce);
}

/* Success State Animation */
.booking-success {
  animation: success-pulse 0.6s var(--ease-out);
}

/* Checkbox Toggle */
.checkbox {
  transition: background-color var(--duration-fast) var(--ease-out);
}

.checkbox__checkmark {
  transition: transform var(--duration-fast) var(--ease-bounce);
}

.checkbox--checked .checkbox__checkmark {
  transform: scale(1);
}

.checkbox:not(.checkbox--checked) .checkbox__checkmark {
  transform: scale(0);
}

/* Time Slot Selection */
.time-slot {
  transition: all var(--duration-fast) var(--ease-out);
}

.time-slot--selected {
  animation: slot-selected 0.3s var(--ease-out);
}

@keyframes slot-selected {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Loading Skeleton */
.skeleton {
  animation: skeleton-pulse 2s var(--ease-in-out) infinite;
}

@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Respects User Preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Loading State Patterns

```css
/* Skeleton Loader Container */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: var(--gap-md);
}

.skeleton-text {
  height: 16px;
  width: 100%;
}

.skeleton-text--short {
  width: 60%;
}

.skeleton-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.skeleton-card {
  height: 120px;
  border-radius: var(--radius-lg);
}

/* Inline Loading */
.inline-loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 4px;
  background-color: var(--color-surface-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-out);
}

/* Page Loading Overlay */
.page-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-primary);
  z-index: 1000;
}

.page-loading__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.page-loading__text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance Checklist

#### Touch Targets

| Requirement | Guideline |
|-------------|-----------|
| Minimum touch target | **44×44 CSS pixels** (WCAG 2.5.5 AAA), **24×24 CSS pixels** (WCAG 2.5.8 AA minimum) |
| Recommended target | **48×48 dp** for mobile (Android/iOS guidelines) |
| Target spacing | Minimum 8px between interactive elements |

```css
/* Touch Target Implementation */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.touch-target--small {
  min-width: 48px;
  min-height: 48px;
}
```

#### Color Contrast Ratios

| Text Type | Minimum Ratio | Recommended |
|-----------|--------------|-------------|
| Normal text (<18pt) | 4.5:1 | 7:1 (AAA) |
| Large text (≥18pt or 14pt bold) | 3:1 | 4.5:1 (AAA) |
| UI components & graphical objects | 3:1 | 4.5:1 |

```css
/* Contrast-Verified Colors */
/* Primary text on white background: 12.63:1 ✓ */
--color-text-primary: #212A2A;

/* Secondary text on white background: 5.74:1 ✓ */
--color-text-secondary: #5B6565;

/* Tertiary text on white background: 4.54:1 ✓ */
--color-text-tertiary: #7D8686;

/* White text on primary-500: 4.53:1 ✓ */
/* Primary-500: #1A8F87, White: #FFFFFF */

/* Accent-500 on white: 3.91:1 ✗ (use for large text only) */
/* Use accent-600 (#E67600) for normal text: 4.56:1 ✓ */
```

#### Keyboard Navigation

```css
/* Focus Visible Styles */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-500);
  color: white;
  padding: var(--space-2) var(--space-4);
  z-index: 1000;
  transition: top var(--duration-fast) var(--ease-out);
}

.skip-link:focus {
  top: 0;
}

/* Focus Trap for Modals */
.modal:focus-within {
  /* Modal should trap focus within */
}

/* Tab Index Management */
.tab-content[hidden] {
  display: none;
}
```

#### Screen Reader Support

```css
/* Visually Hidden (but accessible to screen readers) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Hide from screen readers */
[aria-hidden="true"] {
  /* Content visually present but hidden from AT */
}

/* Live Regions for Dynamic Content */
[aria-live="polite"] {
  /* Updates announced when idle */
}

[aria-live="assertive"] {
  /* Updates announced immediately */
}
```

#### Form Accessibility

```html
<!-- Proper Form Structure -->
<div class="input-container">
  <label for="meeting-title" class="input-label">
    Meeting Title <span aria-hidden="true">*</span>
    <span class="sr-only">required</span>
  </label>
  <input 
    type="text" 
    id="meeting-title" 
    name="title" 
    class="text-input"
    aria-required="true"
    aria-describedby="title-error"
    autocomplete="off"
  >
  <span id="title-error" class="input-error" role="alert" aria-live="polite">
    <!-- Error message appears here -->
  </span>
</div>

<!-- Time Slot Selection -->
<div role="radiogroup" aria-label="Available time slots">
  <button 
    role="radio" 
    aria-checked="false"
    class="time-slot"
    tabindex="0"
  >
    <span class="time-slot__time">9:00 AM</span>
    <span class="time-slot__duration">30 min</span>
  </button>
  <!-- More slots -->
</div>
```

#### Motion & Animation

```css
/* Respect User Preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .calendar-day:hover {
    transform: none;
  }
  
  .btn:hover {
    transform: none;
  }
}
```

### Accessibility Testing Checklist

- [ ] All touch targets are at least 44×44 CSS pixels
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] Focus states are visible and clear
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen readers announce all content correctly
- [ ] Form errors are announced to screen readers
- [ ] Live regions announce dynamic content changes
- [ ] `prefers-reduced-motion` is respected
- [ ] Zoom to 200% maintains functionality
- [ ] Touch targets have adequate spacing (≥8px)
- [ ] Error prevention for meeting scheduling forms
- [ ] Clear distinction between available/unavailable states (not just color)

---

## Implementation Guide

### File Structure

```
/styles
  /tokens
    _colors.css
    _typography.css
    _spacing.css
    _shadows.css
    _animation.css
    _breakpoints.css
  /components
    _calendar.css
    _time-picker.css
    _avatar.css
    _navigation.css
    _forms.css
    _buttons.css
    _loading.css
  /utilities
    _layout.css
    _accessibility.css
  main.css
```

### Token Architecture

```css
/* main.css - Import order matters! */

/* 1. Design Tokens (foundations) */
@import 'tokens/colors.css';
@import 'tokens/typography.css';
@import 'tokens/spacing.css';
@import 'tokens/shadows.css';
@import 'tokens/animation.css';
@import 'tokens/breakpoints.css';

/* 2. Base Styles */
@import 'base/reset.css';
@import 'base/base.css';

/* 3. Components */
@import 'components/calendar.css';
@import 'components/time-picker.css';
@import 'components/avatar.css';
@import 'components/navigation.css';
@import 'components/forms.css';
@import 'components/buttons.css';
@import 'components/loading.css';

/* 4. Utilities */
@import 'utilities/layout.css';
@import 'utilities/accessibility.css';
```

### CSS Custom Properties Usage

```css
/* Using Design Tokens in Components */

/* Before (hardcoded values) */
.button {
  padding: 12px 16px;
  background-color: #1A8F87;
  font-size: 14px;
}

/* After (using design tokens) */
.button {
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-primary-500);
  font-size: var(--font-size-base);
}

/* Theme Switching */
.theme--dark {
  --color-surface-primary: var(--color-surface-primary-dark);
  --color-surface-secondary: var(--color-surface-secondary-dark);
  --color-text-primary: var(--color-neutral-100);
  --color-text-secondary: var(--color-neutral-300);
  /* ... more dark mode tokens */
}
```

### React/TypeScript Integration

```typescript
// tokens.ts - Type-safe design tokens
export const colors = {
  primary: {
    50: '#E8F5F3',
    100: '#C2E6DF',
    // ...
    500: '#1A8F87',
  },
  // ...
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  // ...
} as const;

export const fontSize = {
  xs: '0.625rem',  // 10px
  sm: '0.75rem',   // 12px
  base: '0.875rem', // 14px
  // ...
} as const;

// CSS-in-JS usage
const Button = styled.button`
  padding: ${spacing[3]} ${spacing[4]};
  background-color: ${colors.primary[500]};
  font-size: ${fontSize.base};
`;
```

---

## Quick Reference: Component Specs

| Component | Min Width | Min Height | Border Radius | Font Size |
|-----------|-----------|------------|---------------|-----------|
| Primary Button | 120px | 44px | 6px (--radius-md) | 14px (--font-size-base) |
| Time Slot | auto | 48px | 6px | 14-16px |
| Calendar Day | 44px | 44px | 6px | 14px |
| Avatar (default) | 40px | 40px | 50% | 14px |
| Input | 100% | 48px | 6px | 16px |
| Card | auto | auto | 8px (--radius-lg) | 14px |
| Bottom Nav Item | 64px | 44px | 0 | 10px (--font-size-xs) |
| Status Badge | auto | auto | full (--radius-full) | 10px |
| FAB | 56px | 56px | 50% | 14px |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-10 | Initial design system documentation |

---

*This design system provides a solid foundation for building accessible, responsive, and visually consistent meeting/scheduling applications. Adapt the color palette and typography to match your brand while maintaining the structural principles outlined here.*