import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Chapters from './pages/Chapters';
import Apply from './pages/Apply';
import Contact from './pages/Contact';

// Admin auth + shell
import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';
import Login from './pages/admin/Login';

// Admin pages
import Overview from './pages/admin/Overview';
import Directory from './pages/admin/Directory';
import Releases from './pages/admin/Releases';
import Applications from './pages/admin/Applications';
import Resources from './pages/admin/Resources';

function RoutesWithNavbar() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin login is PUBLIC */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin area (guarded) */}
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Overview />} />
          <Route path="directory" element={<Directory />} />
          <Route path="releases" element={<Releases />} />
          <Route path="applications" element={<Applications />} />
          <Route path="resources" element={<Resources />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <RoutesWithNavbar />
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
