import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from './ui/Button';
import { Package, User as UserIcon, LogOut, Moon, Sun, Bell } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/useAuth';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  
  const [isDark, setIsDark] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize dark mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    // Mock notification count fetch for logged-in user
    if (user) {
      api.get('/orders').then(res => {
        // Just a mock logic: if any order is active, show a notification
        const active = res.data.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
        setUnreadCount(active);
      }).catch(() => {});
    }
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Track Order', path: '/track' },
    { name: 'Book Delivery', path: '/create-shipment' },
  ];

  return (
    <>
      <nav className="navbar-glass shadow-sm border-b border-gray-200 dark:border-gray-800 fixed w-full top-0 z-[9999] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Package className="h-8 w-8 text-[var(--color-primary)] dark:text-white" />
                <span className="font-heading font-bold text-xl tracking-tight text-[var(--color-primary)] dark:text-white">
                  Bhavya Express
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-sm font-bold text-gray-900 dark:text-white hover:text-[var(--color-primary)] dark:hover:text-[var(--color-accent)] transition-colors drop-shadow-sm">
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors drop-shadow-sm">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/track" className="text-gray-600 dark:text-white hover:text-[var(--color-primary)] dark:hover:text-[var(--color-accent)] font-semibold drop-shadow-sm hidden md:block">Track Order</Link>
                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 hidden md:block"></div>
                  
                  <Link to="/notifications" className="relative p-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block drop-shadow-sm">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    )}
                  </Link>

                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="hidden md:block">
                    <Button variant="outline" className="flex items-center gap-2">
                      {user.picture ? (
                        <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4" />
                      )}
                      <span>{user.name}</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="hidden md:flex text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <Button variant="primary">Sign In / Register</Button>
                </Link>
              )}

              {/* Hamburger Button */}
              <button 
                className="md:hidden p-2 text-gray-600 dark:text-gray-300 focus:outline-none flex flex-col justify-center items-center w-10 h-10 relative z-[10000]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`}></span>
                <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div 
          className={`md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden shadow-lg ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block w-full py-3 text-base font-medium text-gray-900 dark:text-gray-200 hover:text-[var(--color-primary)] dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800">
              {user ? (
                <div className="space-y-2">
                  <div className="px-2 py-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Signed in as</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</span>
                  </div>
                  
                  <Link 
                    to={isAdmin ? '/admin' : '/dashboard'} 
                    className="flex items-center gap-2 w-full py-3 px-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    Dashboard
                  </Link>

                  <Link 
                    to="/notifications" 
                    className="flex items-center gap-2 w-full py-3 px-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full py-3 px-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="block w-full py-3 text-center text-base font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[9998] bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
