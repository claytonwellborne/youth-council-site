import React from 'react'
import ReactDOM from 'react-dom/client'
// CHANGE THIS LINE:
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
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
    // CHANGE BrowserRouter -> HashRouter
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/chapters" element={<Chapters />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/about" replace />} />
          </Routes>
        </main>
        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-gray-600 flex items-center justify-between flex-wrap gap-2">
            <span>© {new Date().getFullYear()} Youth Council</span>
            <nav className="flex gap-4">
              <a href="#/about" className="hover:text-gray-900">About</a>
              <a href="#/programs" className="hover:text-gray-900">Programs</a>
              <a href="#/apply" className="hover:text-gray-900">Apply</a>
            </nav>
          </div>
        </footer>
      </div>
    </HashRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
