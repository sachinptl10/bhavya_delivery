import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Package, User as UserIcon, LogOut, Moon, Sun, Bell } from 'lucide-react';
import api from '../utils/api';

export const Navbar = () => {
  const navigate = useNavigate();
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  
  const [isDark, setIsDark] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize dark mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    // Mock notification count fetch for logged-in user
    if (userInfo) {
      api.get('/orders').then(res => {
        // Just a mock logic: if any order is active, show a notification
        const active = res.data.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
        setUnreadCount(active);
      }).catch(() => {});
    }
  }, [userInfo]);

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

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <nav className="navbar-glass shadow-sm border-b border-gray-200 dark:border-gray-800 fixed w-full top-0 z-[9999] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Package className="h-8 w-8 text-[var(--color-primary)] dark:text-blue-400" />
              <span className="font-heading font-bold text-xl tracking-tight text-[var(--color-primary)] dark:text-blue-400">
                Bhavya Express
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-[var(--color-primary)] dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/services" className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-[var(--color-primary)] dark:hover:text-blue-400 transition-colors">
              Services
            </Link>
            <Link to="/about" className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-[var(--color-primary)] dark:hover:text-blue-400 transition-colors">
              About Us
            </Link>
            <Link to="/track" className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-[var(--color-primary)] dark:hover:text-blue-400 transition-colors">
              Track Order
            </Link>
            <Link to="/create-shipment" className="text-sm font-semibold text-gray-900 dark:text-gray-300 hover:text-[var(--color-primary)] dark:hover:text-blue-400 transition-colors">
              Book Delivery
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {userInfo ? (
              <>
                <div className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <Link to={userInfo.role === 'admin' ? '/admin' : '/dashboard'} className="hidden md:block">
                  <Button variant="ghost" className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-slate-800">
                    <UserIcon className="w-4 h-4" />
                    <span>{userInfo.name}</span>
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30">
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost" className="dark:text-gray-300 dark:hover:bg-slate-800">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
