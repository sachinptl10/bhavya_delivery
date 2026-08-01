import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Layouts & Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages — Home stays eager (above the fold); the rest are code-split
import { Home } from './pages/Home';
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const CreateShipment = lazy(() => import('./pages/CreateShipment').then(m => ({ default: m.CreateShipment })));
const Track = lazy(() => import('./pages/Track').then(m => ({ default: m.Track })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const AdminLogin = lazy(() => import('./pages/AdminLogin').then(m => ({ default: m.AdminLogin })));
import { DemoOne } from './components/demo';
import { ShaderAnimation } from './components/ui/shader-animation';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black w-screen h-screen">
    <ShaderAnimation />
    <div className="absolute z-10 flex flex-col items-center justify-center gap-4 pointer-events-none">
      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
        <svg className="w-8 h-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-widest uppercase font-heading drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
        Bhavya Express
      </h2>
      <p className="text-white/60 tracking-wider text-sm animate-pulse">LOADING DASHBOARD...</p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/create-shipment" element={<ProtectedRoute><CreateShipment /></ProtectedRoute>} />
          <Route path="/track" element={<Track />} />
          <Route path="/track/:trackingId" element={<Track />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/demo" element={<DemoOne />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const WhatsAppButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      window.open('https://wa.me/917862887496', '_blank', 'noopener,noreferrer');
    }, 1500);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[9999] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {isLoading ? (
        <svg className="w-8 h-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )}
      {!isLoading && (
        <span className="absolute right-full mr-4 bg-white dark:bg-slate-800 text-gray-800 dark:text-white px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold text-sm pointer-events-none">
          Chat with us!
        </span>
      )}
    </button>
  );
};


function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3000); // Minimum 3 seconds loading animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isAppLoading ? (
        <motion.div
          key="loader"
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999]"
        >
          <PageLoader />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col min-h-screen"
        >
          <BrowserRouter>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-16">
                  <AnimatedRoutes />
                </main>
                <Footer />
                <WhatsAppButton />
                <Toaster position="top-right" />
              </div>
            </AuthProvider>
          </BrowserRouter>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
