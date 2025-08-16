import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Chapters from './pages/Chapters'
import Apply from './pages/Apply'
import Contact from './pages/Contact'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
  {/* Home is the landing page */}
  <Route path="/" element={<Home />} />

  {/* keep /home as alias */}
  <Route path="/home" element={<Navigate to="/" replace />} />

  <Route path="/about" element={<About />} />
  <Route path="/programs" element={<Programs />} />
  <Route path="/chapters" element={<Chapters />} />
  <Route path="/apply" element={<Apply />} />
  <Route path="/contact" element={<Contact />} />

  {/* everything else → Home */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

        </main>

        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600 flex items-center justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} Project 18</span>
            <nav className="flex gap-4">
              <Link to="/about" className="hover:text-gray-900">About</Link>
              <Link to="/programs" className="hover:text-gray-900">Programs</Link>
              <Link to="/apply" className="hover:text-gray-900">Apply</Link>
            </nav>
          </div>
        </footer>
      </div>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)


