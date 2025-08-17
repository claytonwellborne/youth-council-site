import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Chapters from './pages/Chapters';
import Contact from './pages/Contact';
import Ambassador from './pages/Ambassador';

// Admin shell
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

function AppShell() {
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/ambassador" element={<Ambassador />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/programs" element={<Navigate to="/ambassador" replace />} />
        <Route path="/apply" element={<Navigate to="/ambassador" replace />} />

        {/* Admin login is public */}
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
      <AppShell />
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
