import Sidebar from './Sidebar';
import AdminRoutes from '../../pages/admin/_Routes';

export default function AdminLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <AdminRoutes />
        </main>
      </div>
    </div>
  );
}