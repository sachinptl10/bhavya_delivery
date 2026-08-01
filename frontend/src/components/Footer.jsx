import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[var(--color-card)] dark:backdrop-blur-md border-t border-gray-100 dark:border-[var(--color-border)] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-[var(--color-primary)]" />
              <span className="font-heading font-bold text-lg text-[var(--color-primary)]">
                Bhavya Express
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              India's premier logistics network. Book parcel deliveries instantly and track shipments in real-time across 20,000+ pincodes. Founded by Bhavya.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">Services</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/services" className="hover:text-[var(--color-primary)] transition-colors">Local Delivery</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-primary)] transition-colors">Regional Transport</Link></li>
              <li><Link to="/services" className="hover:text-[var(--color-primary)] transition-colors">National Logistics</Link></li>
              <li><Link to="/track" className="hover:text-[var(--color-primary)] transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-[var(--color-primary)] transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-[var(--color-primary)] transition-colors">Contact</Link></li>
              <li>Email: contact@bhavyaexpress.com</li>
              <li>WhatsApp: +91 9876543210</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Bhavya Express. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
