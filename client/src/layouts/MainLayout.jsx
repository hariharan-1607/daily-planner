import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import './MainLayout.css'

export default function MainLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleOpenSidebar = () => {
    setIsMobileSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setIsMobileSidebarOpen(false)
  }

  return (
    <div className="app-shell-layout">
      {/* Sidebar Navigation (Desktop + Mobile Drawer) */}
      <Sidebar isOpen={isMobileSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area */}
      <div className="app-main-viewport">
        <Header onMenuClick={handleOpenSidebar} />

        <main className="app-content-body">
          <div className="content-max-width">
            <Outlet />
          </div>
        </main>

        <footer className="app-dashboard-footer">
          <div className="footer-inner">
            <p className="footer-text">
              &copy; {new Date().getFullYear()} <strong>Daily Planner</strong> &bull; Personal Daily Task Management &bull; Phase 2 UI
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
