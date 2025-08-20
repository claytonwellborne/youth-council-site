import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import './index.css'

/** Public UI */
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Ambassador from './pages/Ambassador'
import Press from './pages/press/Press'
import PressPost from './pages/press/PressPost'

/** Admin UI */

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
    {/* Public site */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/ambassador" element={<Ambassador />} />
    <Route path="/press" element={<Press />} />
    <Route path="/press/:slug" element={<PressPost />} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
