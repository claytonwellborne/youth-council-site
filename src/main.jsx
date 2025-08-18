import React from 'react'
import PublicLayout from './components/layouts/PublicLayout';
import PressHub from './pages/admin/press/PressHub';
import PressEditor from './pages/admin/press/PressEditor';
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './index.css'

/* Public */
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Ambassador from './pages/Ambassador'
import Contact from './pages/Contact'

/* Press (public) */
import Press from './pages/press/Press'
import PressPost from './pages/press/PressPost'

/* Admin guards + layout */
import AdminGuard from './components/AdminGuard'
import RoleGuard from './components/admin/RoleGuard'
import AdminLayout from './components/admin/AdminLayout'

/* Admin pages */
import Login from './pages/admin/Login'
import Overview from './pages/admin/Overview'
import Directory from './pages/admin/Directory'
import Applications from './pages/admin/Applications'
import Resources from './pages/admin/Resources'
import Executive from './pages/admin/Executive'
import ProfileSettings from './pages/admin/ProfileSettings'
import AccountSettings from './pages/admin/AccountSettings'
import { AdminProvider } from './components/admin/AdminContext'

function PublicLayout(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <HashRouter>
  <Routes>
    {/* Public site (with Navbar via PublicLayout) */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/ambassador" element={<Ambassador />} />
      <Route path="/press" element={<Press />} />
      <Route path="/press/:slug" element={<PressPost />} />
      <Route path="/contact" element={<Contact />} />
    </Route>

    {/* Admin auth (standalone) */}
    <Route path="/admin/login" element={<Login />} />

    {/* Admin app (no public navbar) */}
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
    
  <Route path="press" element={<PressHub />} />
  <Route path="press/create" element={<PressEditor />} />
</Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</HashRouter>
    </AdminProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
