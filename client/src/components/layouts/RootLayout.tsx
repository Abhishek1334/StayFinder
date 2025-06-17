import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layouts/Footer';
import { Toaster } from 'sonner';

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="top-center"
        expand={true}
        richColors
        closeButton
        theme="light"
      />
    </div>
  );
};

export default RootLayout; 