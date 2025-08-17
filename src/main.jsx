import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import './index.css'
import Resources from './pages/admin/Resources'
import Releases from './pages/admin/Releases'
import Directory from './pages/admin/Directory'
import Overview from './pages/admin/Overview'
import AdminLayout from './components/admin/AdminLayout'
import { useLocation, NavLink } from 'react-router-dom'
import AdminGuard from './components/AdminGuard'

const Login = React.lazy(() => import('./pages/admin/Login'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Applications = React.lazy(() => import('./pages/admin/Applications'));


import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Chapters from './pages/Chapters'
import Contact from './pages/Contact'
import Ambassador from './pages/Ambassador'

function Shell(){
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith('/admin');
  return (<>
    {!isAdmin && <Navbar />}
    <Routes>
        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>} />
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <React.Suspense fallback={<div style={{padding:24}}>Loading…</div>}><Routes>
        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>} />
        <Route index element={<Home />} />
        <Route index element={<Home />} />
        {/* admin */}} /></AdminGuard>} /></AdminGuard>} />
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
            <Route path="*" element={<Navigate to="/" replace />} />} />
      </Routes></>)}

function App() {</React.Suspense>
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