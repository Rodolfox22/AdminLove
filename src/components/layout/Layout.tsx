import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
