# Daily Planner

A personal daily task management, calendar scheduling, and daily reflection web application.

## Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: JavaScript (JSX)
- **Styling**: Plain CSS (Design system with CSS variables, no Tailwind CSS)
- **Routing**: React Router (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)
- **State & Persistence**: React Context API & Browser `localStorage`

## Features Implemented

### Phase 1: Frontend Initialization
- React + Vite development environment.
- Modular folder structure (`components/`, `pages/`, `layouts/`, `context/`, `services/`, `utils/`).
- Responsive base layout and typography.

### Phase 2: Modern Dashboard UI
- Responsive sidebar with active link highlighting and mobile drawer navigation.
- Dashboard header with dynamic date, motivational greeting, and notification indicator.
- Dynamic summary metric cards (Total, Completed, Partially Completed, Pending).
- Today's checklist section and carried-forward tasks widget.
- Quick actions shortcut panel.

### Phase 3: Daily Task Creation & Management
- Single task creation modal with validation, priority (High, Medium, Low), and category tags.
- Bulk task input parser (numbered and bullet list extraction with editable preview).
- Mutually exclusive task status management (Pending, Partially Completed with remaining work, Completed with strike-through).
- Task editing, deletion confirmation, and status filtering.
- Timezone-safe date navigation toolbar.

### Phase 4: Automatic Carry-Forward, Overdue Management & Persistence
- Automatic carry-forward engine rolling unfinished past tasks forward to today.
- Original scheduled date preservation and overdue calendar-day calculations.
- Dedicated **Overdue Tasks** management page (`/overdue`) with complete/reschedule actions.
- Dynamic sidebar overdue count badge.
- Versioned `localStorage` service (`dailyPlanner.tasks.v1`) with fallback.

### Phase 5: Calendar Management & Daily Review
- **Monthly Planner Calendar (`/calendar`)**:
  - Full monthly calendar grid with month navigation and "Today" shortcut.
  - Date highlighting for actual current date and active selected date.
  - Scheduled task count badges and status indicator dots (Completed, Partial, Pending).
  - Selected date task panel with inline task creation, editing, status toggles, and rescheduling.
- **Daily Review & Self-Reflection (`/review`)**:
  - Daily performance summary with completion score bar.
  - 5-question structured daily reflection form:
    1. *What went well today?*
    2. *What challenges did I face?*
    3. *What could I improve?*
    4. *What did I learn today?*
    5. *What are my priorities for tomorrow?*
  - Historical review inspection by date with date-keyed `localStorage` persistence (`dailyPlanner.reviews.v1`).
  - Side-by-side reference list of tasks scheduled for the review date.
  - **Dynamic Daily Reflection Rule**:
    - 40 unique principles and quotes across 8 categories (Discipline, Time Management, Learning, Focus, Self-Awareness, Goal Setting, Problem-Solving, Persistence).
    - Deterministic date-based selection ensuring historical consistency without external APIs.

## Getting Started

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
