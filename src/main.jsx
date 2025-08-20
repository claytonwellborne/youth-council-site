import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './index.css'

/** Public UI */
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Chapters from './pages/Chapters'
import Apply from './pages/Apply'
import Ambassador from './pages/Ambassador'
import Contact from './pages/Contact'
import Press from './pages/press/Press'
import PressPost from './pages/press/PressPost'

/** Admin UI */
import AdminGuard from '@/components/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'
import Login from '@/pages/admin/Login'
import Overview from '@/pages/admin/Overview'
import Directory from '@/pages/admin/Directory'
import Resources from '@/pages/admin/Resources'
import Applications from '@/pages/admin/Applications'
import Executive from '@/pages/admin/Executive'
import ProfileSettings from '@/pages/admin/ProfileSettings'
import AccountSettings from '@/pages/admin/AccountSettings'
import PressHub from './pages/admin/press/PressHub'
import PressEditor from './pages/admin/press/PressEditor'

/** Public shell to keep Navbar off admin pages */
function PublicShell() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function App() {
  return (
    <HashRouter>
  <Routes>
    <!-- Public site -->
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/ambassador" element={<Ambassador />} />
    <Route path="/press" element={<Press />} />
    <Route path="/press/:slug" element={<PressPost />} />
    <!-- (removed) <Route path="/contact" element={<Contact />} /> -->

    <!-- Admin auth -->
    <Route path="/admin/login" element={<Login />} />

    <!-- Admin app (sidebar layout, children rendered via <Outlet/>) -->
    <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
      <Route index element={<Overview />} />
      <Route path="directory" element={<Directory />} />
      <Route path="applications" element={<Applications />} />
      <!-- removed: resources, executive sub-features will be trimmed below -->
      <!-- removed: press & press/create -->
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="account" element={<AccountSettings />} />
    </Route>

    <!-- Fallback -->
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
