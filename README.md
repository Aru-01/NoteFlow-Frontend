# NoteFlow - Frontend

> A modern, human-centered workspace for organized notes, real-time deadline countdowns, and topic-driven community discussions.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why NoteFlow?](#-why-noteflow)
- [Who Is It For?](#-who-is-it-for)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started Locally](#-getting-started-locally)
- [Environment Configuration](#-environment-configuration)
- [Building for Production & Vercel](#-building-for-production--vercel)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 📖 Overview

**NoteFlow** is a modern full-stack web application designed to bring structured personal task management and an authentic community feed into one unified tab.

Users can organize daily notes, assign priority levels, monitor real-time deadline countdowns, and choose whether to keep their thoughts private or publish them to the community. Powered by secure 6-digit email OTP verification, JWT session authentication, and Role-Based Access Control (RBAC), NoteFlow offers an intuitive experience for regular members and administrators alike.

---

## 💡 Why NoteFlow?

Most task and note-taking apps fall into one of two extremes:
1. **Too complex and cluttered**, full of complicated tables and enterprise setup workflows.
2. **Completely isolated**, lacking any way to share discoveries or discuss ideas with like-minded peers.

**NoteFlow bridges this gap.** It gives you:
- A clean, distraction-free space for everyday notes with live deadline timers.
- A built-in community feed where you can publish thoughts either publicly to the web or exclusively to verified members.
- Automatic interest matching that connects you to active topic circles based on shared profile interests.

---

## 👥 Who Is It For?

- **Students & Self-Learners:** Track study schedules, assignments, and exam deadlines with live countdown timers.
- **Software Engineers & Creators:** Organize personal task backlogs, write technical notes, and share insights with the developer community.
- **Busy Professionals:** Maintain a clean daily priority list with one-click status transitions (Pending $\to$ Started $\to$ In Progress $\to$ Done).
- **Communities & Teams:** Collaborate with distinct regular User and Administrator privileges, ensuring safe community moderation.

---

## ✨ Key Features

### 1. Structured Notes & Live Deadline Countdown
- **Priority Classification:** Low, Medium, High, and Urgent tiers with color-coded status pills.
- **Workflow Lifecycle:** Effortlessly move tasks through `Pending`, `Started`, `In Progress`, and `Completed`.
- **Live Deadline Timers:** Dynamic real-time countdown timer showing Days, Hours, Minutes, and Seconds remaining until the deadline date, with automatic overdue alerts.
- **Detailed Note Modal:** View full note descriptions, created dates, and update statuses directly with one click.
- **Search & Filters:** Instant search by title or description, filtered by priority or progress state.

### 2. Dual-Tier Community Feed & Reactions
- **Flexible Privacy:**
  - **Public Posts:** Viewable by everyone across the web.
  - **Member-Only Posts:** Restricted strictly to authenticated, verified platform users.
- **Instant Reactions:** Interactive heart reactions with live optimistic counters and toggle capability.
- **Topic Discovery Circles:** Automatically aggregates users into interest groups based on shared profile topics.

### 3. Authentication & Security
- **6-Digit Email OTP:** Secure passwordless verification for new registrations and forgotten passwords.
- **Silent JWT Rotation:** Axios request and response interceptors automatically refresh expired access tokens in the background without logging the user out.
- **Password Visibility:** Toggle between hidden and revealed password fields on login, registration, and reset forms.
- **Self Profile Management:** Edit your username and manage your interest tags anytime.

### 4. Admin Management Suite
- **User Directory:** Search and filter all registered platform users by role and verification status.
- **Single User Deep-Dive:** Click on any user row to view their individual authored notes, community posts, and registration timeline.
- **Role Elevation & Moderation:** Promote regular users to administrators or demote them with immediate role updates.
- **Safe Account Removal:** Secure deletion flow with confirmation modals to protect against accidental account loss.

### 5. Design & User Experience
- **Tactile Modern Design:** Built with neutral, high-contrast aesthetics and subtle glassmorphic surfaces.
- **Dark & Light Mode:** Seamless theme toggling with zero flash on initial page load.
- **Hydration Safe:** Standardized date formatting and deterministic rendering across all pages.
- **Fluid Motion:** Smooth scrolling powered by Lenis, accompanied by micro-animations from Framer Motion.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Smooth Scrolling** | [Lenis](https://lenis.darkroom.engineering/) |
| **HTTP Client** | [Axios](https://axios-http.com/) with JWT Refresh Interceptors |
| **Backend API** | [Django 5 & Django REST Framework](https://www.django-rest-framework.org/) (DRF) |

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/              # User sign in with password visibility toggle
│   │   ├── register/           # Registration with interest tags
│   │   ├── verify-otp/         # 6-digit email OTP verification
│   │   └── forgot-password/    # Multi-step password reset with OTP
│   ├── admin/
│   │   └── users/
│   │       ├── page.js         # Admin user directory & management
│   │       └── [id]/page.js    # Single user activity view (notes + posts)
│   ├── notes/                  # Personal notes & task deadline countdowns
│   ├── posts/                  # Community feed & topic discovery circles
│   ├── profile/                # User profile & interest tag customization
│   ├── about/                  # Project background & architecture overview
│   ├── contact/                # Contact & support inquiry form
│   ├── layout.js               # Global root layout with providers
│   ├── page.js                 # Interactive landing page & live showcase
│   └── globals.css             # Tailwind v4 theme configurations
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Responsive navbar with admin links & theme toggle
│   │   └── Footer.jsx          # Clean footer with quick links & author credit
│   ├── providers/
│   │   └── SmoothScroll.jsx    # Lenis smooth scroll provider
│   └── ui/
│       ├── Button.jsx          # Reusable tactile button component
│       ├── CountdownTimer.jsx  # Live Days/Hours/Minutes/Seconds deadline timer
│       ├── GlassCard.jsx       # Frosted glass container card
│       └── AmbientBackground.jsx
├── context/
│   ├── AuthContext.jsx         # Global session, user state, and login handlers
│   └── ThemeContext.jsx        # Dark/light theme state with document sync
└── lib/
    ├── api.js                  # Axios client with automatic JWT token refresh
    ├── constants.js            # API endpoints & backend configuration
    └── utils.js                # Deterministic date formatting & token storage
```

---

## 🚀 Getting Started Locally

Follow these step-by-step instructions to run the frontend application on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18.18.0` or higher (Node 20+ recommended)
- **npm**, **pnpm**, or **yarn**
- **Git**

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/aru-01/NoteFlow-Frontend.git
cd NoteFlow-Frontend
```

---

### Step 2: Install Dependencies

```bash
npm install
```

---

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Or manually create `.env.local` and add the backend base URL:

```env
# Local Django Backend
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Or point directly to the live production backend:
# NEXT_PUBLIC_API_BASE_URL=https://note-flow-backend-eta.vercel.app
```

---

### Step 4: Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:3000
```

The application is now running with hot reloading enabled.

---

### Step 5: Run Code Linting & Build Verification

Check that your code adheres to all React 19 and Next.js 16 linting rules:

```bash
# Run ESLint check
npm run lint

# Test production build
npm run build
```

---

## 🌐 Environment Configuration

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | The URL where your Django REST backend is hosted. | `https://note-flow-backend-eta.vercel.app` |

---

## 👨‍💻 Author & Acknowledgments

- **Developed by:** Arif ([@aru-01](https://github.com/aru-01))
- **Portfolio & GitHub:** [Portfolio](https://dev-arif17.vercel.app)
- **Built with:** Next.js, React, Tailwind CSS, Framer Motion, and Django REST Framework.

Crafted with care for clean design, fast performance, and practical everyday utility.
