import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
