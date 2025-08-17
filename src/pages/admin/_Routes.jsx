import { Routes, Route } from 'react-router-dom';
import Overview from './Overview';
import Directory from './Directory';
import Releases from './Releases';
import Applications from './Applications';
import Resources from './Resources';
import Login from './Login';

export default function AdminRoutes(){
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Overview />} />
      <Route path="/admin/directory" element={<Directory />} />
      <Route path="/admin/releases" element={<Releases />} />
      <Route path="/admin/applications" element={<Applications />} />
      <Route path="/admin/resources" element={<Resources />} />
    </Routes>
  );
}
