import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import './index.css'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Chapters from './pages/Chapters'
import Contact from './pages/Contact'
import Ambassador from './pages/Ambassador'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
        {/* admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminGuard><Dashboard /></AdminGuard>} />
        <Route path="/admin/applications" element={<AdminGuard><Applications /></AdminGuard>} />
            {/* Landing */}
            <Route path="/" element={<Home />} />
            {/* keep /home as alias */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Core pages */}
            <Route path="/about" element={<About />} />
            <Route path="/ambassador" element={<Ambassador />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/contact" element={<Contact />} />

            {/* Redirect old paths */}
            <Route path="/programs" element={<Navigate to="/ambassador" replace />} />
            <Route path="/apply" element={<Navigate to="/ambassador" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600 flex items-center justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} Project 18</span>
            <nav className="flex gap-4">
              <Link to="/about" className="hover:text-gray-900">About</Link>
              <Link to="/ambassador" className="hover:text-gray-900">Ambassador</Link>
              <Link to="/ambassador" className="hover:text-gray-900">Apply</Link>
            </nav>
          </div>
        </footer>
      </div>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
