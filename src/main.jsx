import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Navbar from './components/Navbar'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Chapters from './pages/Chapters'
import Apply from './pages/Apply'
import Ambassador from './pages/Ambassador'
import Contact from './pages/Contact'
import Press from './pages/press/Press'
import PressPost from './pages/press/PressPost'

// Admin
import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import Applications from '@/pages/admin/Applications'
import Executive from '@/pages/admin/Executive'
import PressHub from './pages/admin/press/PressHub'
import PressEditor from './pages/admin/press/PressEditor'

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/ambassador" element={<Ambassador />} />
        <Route path="/press" element={<Press />} />
        <Route path="/press/:slug" element={<PressPost />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin auth (standalone) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin app (sidebar layout with nested children) */}
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="executive" element={<Executive />} />
          <Route path="press" element={<PressHub />} />
          <Route path="press/create" element={<PressEditor />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
