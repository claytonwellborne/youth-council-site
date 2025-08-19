import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';
// src/main.jsx (or wherever your Router lives)
import Ambassador from './pages/Ambassador';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Chapters from './pages/Chapters'
import Apply from './pages/Apply'
import Contact from './pages/Contact'

import AdminGuard from '@/components/AdminGuard'
import Login from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import Applications from '@/pages/admin/Applications'

import PressHub from './pages/admin/press/PressHub';
import PressEditor from './pages/admin/press/PressEditor';

import Press from './pages/press/Press'
import PressPost from './pages/press/PressPost'

import Settings from './pages/admin/Settings'
import PressCreation from './pages/admin/press/PressEditor'
import Executive from './pages/admin/Executive'

function App() {
  return (
    <HashRouter>
  <Routes>
    {/* Public site */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />} />
    <Route path="/press" element={<Press />} />
    <Route path="/press/:slug" element={<PressPost />} />
    <Route path="/contact" element={<Contact />} />

    {/* Admin auth (standalone) */}
    <Route path="/admin/login" element={<Login />} />

    {/* Admin app (sidebar layout with nested children) */}
    <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
      <Route index element={<Overview />} />
      <Route path="directory" element={<Directory />} />
      <Route path="applications" element={<Applications />} />
      <Route path="resources" element={<Resources />} />
      <Route path="executive" element={<Executive />} />
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="account" element={<AccountSettings />} />
      {/* Press */}
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
