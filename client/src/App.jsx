import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  CheckSquare,
  Calendar,
  AlertCircle,
  History,
  ClipboardCheck,
  FileSpreadsheet,
  BarChart3,
  Settings
} from 'lucide-react'
import { TaskProvider } from './context/TaskContext'
import MainLayout from './layouts/MainLayout'
import DashboardPage from './pages/DashboardPage'
import OverdueTasksPage from './pages/OverdueTasksPage'
import PlaceholderPage from './pages/PlaceholderPage'

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Main Dashboard */}
            <Route index element={<DashboardPage />} />

            {/* Overdue Tasks Page (Active Phase 4) */}
            <Route path="overdue" element={<OverdueTasksPage />} />

            {/* Navigation Routes with Clean Branded Placeholders */}
            <Route
              path="tasks"
              element={
                <PlaceholderPage
                  title="My Daily Tasks"
                  icon={CheckSquare}
                  phase="Phase 5"
                  description="Comprehensive task checklist management, priority sorting, filtering, and CRUD operations."
                />
              }
            />

            <Route
              path="calendar"
              element={
                <PlaceholderPage
                  title="Calendar & Timeline"
                  icon={Calendar}
                  phase="Phase 5"
                  description="Interactive calendar view to visualize daily deadlines, scheduled hours, and milestone planning."
                />
              }
            />

            <Route
              path="history"
              element={
                <PlaceholderPage
                  title="Task History"
                  icon={History}
                  phase="Phase 5"
                  description="Audit log and searchable archive of completed milestones, historical performance, and previous days."
                />
              }
            />

            <Route
              path="review"
              element={
                <PlaceholderPage
                  title="Daily Review"
                  icon={ClipboardCheck}
                  phase="Phase 5"
                  description="End-of-day evaluation scorecard, reflection journaling, and carry-forward decision workflows."
                />
              }
            />

            <Route
              path="checklist"
              element={
                <PlaceholderPage
                  title="My Checklist (Google Sheets)"
                  icon={FileSpreadsheet}
                  phase="Phase 6"
                  description="Real-time two-way synchronization bridge linking your Daily Planner with your personal Google Sheets."
                />
              }
            />

            <Route
              path="analytics"
              element={
                <PlaceholderPage
                  title="Analytics & Insights"
                  icon={BarChart3}
                  phase="Phase 5"
                  description="Productivity velocity metrics, completion breakdown charts, streak tracking, and focus trends."
                />
              }
            />

            <Route
              path="settings"
              element={
                <PlaceholderPage
                  title="Settings & Preferences"
                  icon={Settings}
                  phase="Phase 7"
                  description="Customize notification alerts, display preferences, timezone configuration, and backup options."
                />
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  )
}
