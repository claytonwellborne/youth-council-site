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
import Press from './pages/press/Press'
import PressPost from './pages/press/PressPost'

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
        <Route element={<PublicShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/ambassador" element={<Ambassador />} />
          <Route path="/press" element={<Press />} />
          <Route path="/press/:slug" element={<PressPost />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
