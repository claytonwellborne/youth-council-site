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

// Admin
import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';
import RoleGuard from './components/admin/RoleGuard';
import Login from './pages/admin/Login';

// Admin pages
import Overview from './pages/admin/Overview';
import Directory from './pages/admin/Directory';
import Releases from './pages/admin/Releases';
import Applications from './pages/admin/Applications';
import Resources from './pages/admin/Resources';
import Executive from './pages/admin/Executive';

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
        <Route path="/ambassador" element={<Apply />} />
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
          <Route
            path="directory"
            element={
              <RoleGuard allow={['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr','regional_coordinator']}>
                <Directory />
              </RoleGuard>
            }
          />
          <Route
            path="releases"
            element={
              <RoleGuard allow={['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr','ambassador']} committee="policy">
                <Releases />
              </RoleGuard>
            }
          />
          <Route
            path="applications"
            element={
              <RoleGuard allow={['executive_director','chief_of_staff','vp_membership','regional_coordinator']}>
                <Applications />
              </RoleGuard>
            }
          />
          <Route
            path="resources"
            element={
              <RoleGuard allow={['executive_director','chief_of_staff','vp_membership','vp_finance','vp_pr','regional_coordinator','ambassador']}>
                <Resources />
              </RoleGuard>
            }
          />
          <Route
            path="executive"
            element={
              <RoleGuard allow={['executive_director','chief_of_staff']}>
                <Executive />
              </RoleGuard>
            }
          />
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
