# Ascend Academics - Design Guidelines

## Design Approach
**System-Based with Custom Aesthetic**: Futuristic dark theme with royal purple accents, drawing inspiration from modern SaaS platforms like Stripe and Linear, but with a distinctive sci-fi edge suitable for an academic tutoring service.

## Core Visual Identity

### Color Palette
- **Primary Background**: Dark grey (#1a1a1a to #0f0f0f)
- **Secondary Background**: Slightly lighter grey (#2a2a2a) for cards and elevated surfaces
- **Accent Color**: Royal purple (#6b46c1 to #7c3aed) for CTAs, highlights, and interactive elements
- **Purple Glow Effects**: Use subtle purple glows (box-shadow with purple) on cards and interactive elements for futuristic feel
- **Text Colors**: 
  - Primary text: Near-white (#f5f5f5)
  - Secondary text: Light grey (#a0a0a0)
  - Accent text: Purple for links and highlights

### Typography
- **Primary Font**: Modern sans-serif from Google Fonts (e.g., "Inter" or "Space Grotesk" for futuristic feel)
- **Headings**: Bold, large scale (text-4xl to text-6xl for hero, text-2xl to text-3xl for sections)
- **Body Text**: Medium weight, comfortable reading size (text-base to text-lg)
- **Form Labels**: Smaller, uppercase with letter-spacing for futuristic aesthetic

### Layout System
**Spacing Units**: Consistent use of Tailwind's 4, 8, 12, 16, 24, 32 pixel increments
- Section padding: py-16 to py-24
- Card padding: p-6 to p-8
- Component gaps: gap-4 to gap-8

## Landing Page Structure

### Hero Section (80vh)
- **Layout**: Full-width with centered content overlay
- **Background**: Dark gradient (grey to darker grey) with subtle purple glow effects or particles
- **Hero Image**: Abstract futuristic education-themed visual (digital learning, neural networks, ascending graphs) - position as background with dark overlay
- **Content**: 
  - Large headline emphasizing "Ascend" and academic excellence
  - Subtitle describing tutoring services
  - Dual CTAs: "Sign Up" (purple, prominent) and "Login" (outlined, secondary)
  - Floating glass-morphic card effect for CTA container

### Tutoring Business Details Section
- **3-Column Grid** (on desktop, stacked on mobile) showcasing:
  - Services offered
  - Subject expertise
  - Success metrics/testimonials
- **Card Design**: Dark background with purple border-glow, rounded corners (rounded-xl)
- **Icons**: Use Heroicons in purple for visual hierarchy

### Features/Benefits Section
- **2-Column Layout** alternating image and text
- Highlight personalized learning, expert tutors, flexible scheduling
- Use purple accent lines or borders to separate content blocks

## Authentication UI Design

### Multi-Step Sign Up Flow
**Container**: Centered modal-style card (max-w-md) with dark background, purple glow border
**Progress Indicator**: 4-step horizontal stepper at top (Step 1: Email, Step 2: Age, Step 3: Password, Step 4: Verify)

**Step 1 - Email Entry**:
- Single input field with purple focus ring
- Large "Continue" button (purple, full-width)
- Input styling: Dark background, light border, rounded-lg

**Step 2 - Age Entry**:
- Number input or dropdown for age selection
- Back and Continue buttons (Back: outlined, Continue: purple filled)

**Step 3 - Password Entry**:
- Note: Uses InstantDB magic code, so display generated code or instruction
- Clear explanation that code will be sent to email
- "Send Code" button (purple)

**Step 4 - Email Verification**:
- Code input field (6 digits, styled individually or single field)
- "Verify" button (purple)
- "Resend Code" link (purple text, underlined on hover)

### Login Flow
**Container**: Same styled card as sign up
**Two Fields**:
- Email input
- Magic code/password input
**Actions**:
- "Login" button (purple, full-width)
- "Don't have an account? Sign up" link below

### Form Input Styling
- **Background**: Darker grey (#1f1f1f)
- **Border**: 1px light grey, purple on focus
- **Padding**: py-3 px-4
- **Border Radius**: rounded-lg
- **Text**: Light grey placeholder, white input text
- **Focus State**: Purple ring (ring-2 ring-purple-600)

## Component Design Patterns

### Buttons
- **Primary (Purple)**: bg-purple-600 hover:bg-purple-700, text-white, py-3 px-6, rounded-lg, font-semibold
- **Secondary (Outlined)**: border-2 border-purple-600, text-purple-400, hover:bg-purple-600/10
- **Transitions**: All buttons use transition-all duration-200

### Cards
- **Background**: bg-gray-900/50 (semi-transparent for depth)
- **Border**: border border-gray-800 with purple glow (box-shadow: 0 0 20px rgba(107, 70, 193, 0.3))
- **Hover State**: Increase purple glow intensity
- **Border Radius**: rounded-xl to rounded-2xl

### Navigation (if needed)
- **Sticky top bar**: Dark background with blur effect (backdrop-blur-lg)
- **Logo**: "Ascend Academics" with purple gradient accent
- **Links**: Light grey, purple on hover
- **Auth buttons**: Login (outlined), Sign Up (purple filled)

## Images

### Hero Section
- **Primary Hero Image**: Abstract futuristic education visual - neural network patterns, ascending arrow graphics, or digital learning interface mockups
- **Placement**: Full-width background with dark overlay (bg-black/40)
- **Style**: High-tech, purple and blue accents to complement theme

### Features Section
- **Supporting Images**: Students studying, tutoring sessions, or abstract academic success visuals
- **Treatment**: Rounded corners, subtle purple border glow to match theme

## Animations & Effects
- **Minimal**: Only use subtle fade-ins for content reveal
- **Glow Effects**: Purple glows on cards and buttons (static, not animated)
- **Hover Transitions**: Smooth 200ms transitions for interactive elements
- **No**: Heavy animations, parallax, or distracting motion

## Accessibility
- Maintain 4.5:1 contrast ratio for text on dark backgrounds
- Purple accent must be bright enough (#7c3aed or lighter) for visibility
- All form inputs have clear labels and focus states
- Keyboard navigation support for multi-step forms