import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { AdminProvider } from './AdminContext';

export default function AdminLayout() {
  return (
    <AdminProvider>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
