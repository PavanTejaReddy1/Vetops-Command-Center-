# VetOps Command Center

An AI-powered Veterinary Care Predictive Operations Command Center. Phase 1 delivers
the **frontend foundation and project architecture only** — no business logic, no live
backend APIs, no MongoDB connection, no Groq AI integration. Everything is built to be
extended in Phase 2 without restructuring.

## Quick start

```bash
# Frontend
cd frontend
npm install
npm run dev        # http://localhost:5173

# Backend (structure only — boots, but every route returns 501)
cd backend
npm install
npm run dev         # http://localhost:5000/health
```

---

## Frontend architecture (`/frontend`)

```
frontend/
├── src/
│   ├── app/
│   │   ├── router.jsx              # Route table, lazy-loaded per module
│   │   └── providers/
│   │       ├── AppProviders.jsx    # Single composition point for all context providers
│   │       └── ThemeProvider.jsx   # Light/dark theme state (class-based, persisted)
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.jsx     # Shell: Sidebar + Topbar + <Outlet/>
│   │   ├── Sidebar.jsx             # Collapsible desktop rail + mobile drawer
│   │   ├── Topbar.jsx              # Search, notifications, quick actions, theme, profile
│   │   └── Breadcrumbs.jsx         # Route-derived breadcrumb trail
│   │
│   ├── components/ui/              # Reusable, presentation-only design system
│   │   ├── Button, Card, KpiCard, Badge, StatusBadge, Modal, Input,
│   │   │   Table/DataTable, Pagination, SearchBar, FilterBar, Alert,
│   │   │   EmptyState, LoadingSkeleton, PageHeader, VitalPulse
│   │   └── index.js                # Barrel export
│   │
│   ├── pages/                      # One folder per sidebar module
│   │   ├── Dashboard/
│   │   ├── WorkflowQueue/
│   │   ├── ForecastCapacity/
│   │   ├── TaskAssignment/
│   │   ├── Predictions/
│   │   ├── AIReview/
│   │   ├── Reports/
│   │   ├── Notifications/
│   │   ├── Users/
│   │   ├── AuditLogs/
│   │   ├── Settings/
│   │   └── NotFound/
│   │
│   ├── data/                       # Dummy data — deletable wholesale once APIs exist
│   │   ├── veterinarians.js, petOwners.js, animals.js, appointments.js,
│   │   │   tasks.js, alerts.js, notifications.js, kpiMetrics.js
│   │
│   ├── hooks/                      # useTheme, useDisclosure, useBreadcrumbs
│   ├── lib/
│   │   ├── api/axiosClient.js      # Pre-configured Axios instance (not yet called anywhere)
│   │   ├── utils/                  # cn() class merger, formatters
│   │   └── constants/navigation.js # Single source of truth for sidebar + breadcrumbs
│   └── config/site.js              # App name, org name, etc.
│
├── tailwind.config.js               # Design tokens (see "Design system" below)
├── index.css                        # CSS variables for light/dark theme
└── index.html
```

### Why it's structured this way

- **`data/` is a drop-in replacement boundary.** Every page imports dummy data from
  `src/data/*`. In Phase 2, each file is replaced by a call through `lib/api/axiosClient.js`
  to the matching backend route — no page component needs to change shape, only its data
  source.
- **`components/ui` never contains business logic or fetches.** They're pure, reusable,
  and already handle their own loading (`LoadingSkeleton`) and empty (`EmptyState`) states,
  so every page gets consistent states for free.
- **`lib/constants/navigation.js` is the single source of truth** for the sidebar, the
  breadcrumb system, and (in Phase 2) any command palette — a new module is registered once.
- **Routes are lazy-loaded** (`React.lazy` + `Suspense`) per module, so the initial bundle
  only pays for the Dashboard, and each other module ships as its own chunk (verified via
  `npm run build`).

### Design system

Built around the product's subject matter — an operations "vitals monitor" for a
veterinary hospital — rather than generic Tailwind defaults:

- **Color:** a clinical teal (`brand`) as the primary action/identity color, with a
  vitals-monitor-inspired signal palette (`signal.amber` / `signal.rose` / `signal.blue` /
  `signal.success`) used consistently for severity, status, and trend direction across the
  whole app.
- **Type:** Sora (display/headings), Inter (body), IBM Plex Mono (KPI numbers, timestamps,
  IDs — reinforces the "instrument panel" feel of an ops command center).
- **Signature motif — `VitalPulse`:** a minimal EKG/heartbeat-line SVG component used as
  the KPI trend sparkline and as an animated loading cue, tying "operational health" back
  to the veterinary domain instead of a generic spinner.
- **Theming:** implemented with CSS variables in `index.css` (`:root` / `.dark`), consumed
  through Tailwind's `rgb(var(--token) / <alpha-value>)` pattern — components never branch
  on theme, they only read tokens, so adding a third theme later is a CSS-only change.

### Responsive behavior

- **Desktop (`lg+`):** fixed sidebar (collapsible to an icon rail), full topbar.
- **Tablet:** same as desktop; sidebar remains usable in collapsed form as the viewport narrows.
- **Mobile:** sidebar becomes an off-canvas drawer (hamburger in the topbar); search collapses
  out of the topbar; KPI grids and tables reflow to single-column / horizontal-scroll.

---

## Backend architecture (`/backend`) — structure only

The backend **boots and serves real routes**, but every handler intentionally returns
`501 Not Implemented` and MongoDB is never connected — this proves the API surface and
folder structure are correct without pretending Phase 1 has real business logic.

```
backend/
├── server.js                 # Entry point — starts Express, does NOT connect MongoDB
├── src/
│   ├── app.js                 # Express app factory (middleware, routers, error handling)
│   ├── config/
│   │   └── database.js        # Mongoose connection — stubbed, throws if called (Phase 2)
│   ├── routes/                # One router per module, all mounted under /api/v1
│   │   └── index.js           # Aggregates every module router
│   ├── controllers/            # One per module — handlers return 501 for now
│   ├── services/               # One per module — business logic layer, throws "not implemented"
│   │   └── groq.service.js   # AI integration entry point (Phase 2, not wired up)
│   ├── models/                 # One per module — Mongoose schema placeholders + comments
│   ├── middleware/
│   │   ├── requireAuth.js     # No-op today; JWT verification shape documented for Phase 2
│   │   ├── notFoundHandler.js
│   │   └── errorHandler.js
│   ├── validators/            # zod schema placeholders (mirrors frontend's zod usage)
│   └── utils/
│       └── asyncHandler.js
```

Every module (`veterinarians`, `appointments`, `forecasts`, `tasks`, `predictions`,
`ai-reviews`, `reports`, `notifications`, `users`, `audit-logs`, `settings`) follows the
identical `route → controller → service → model` layering, so Phase 2 work is: implement
the model schema, implement the service query, remove the `501` stub from the controller —
routing and middleware don't change.

---

## What Phase 1 deliberately does NOT include

- No business logic (filtering/sorting is client-side/demo only, not derived from real rules)
- No live API calls from the frontend — everything reads `src/data/*`
- No MongoDB connection
- No Groq AI integration
- No authentication enforcement (middleware exists as a documented no-op)

These are all Phase 2+ scope, and the structure above is built so none of them require
reshaping what already exists.
