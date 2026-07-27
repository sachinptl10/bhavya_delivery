import React from 'react';
import { Package } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-[var(--color-primary)]" />
              <span className="font-heading font-bold text-lg text-[var(--color-primary)]">
                Bhavya Express
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">
              India's premier logistics network. Book parcel deliveries instantly and track shipments in real-time across 20,000+ pincodes. Founded by Bhavya.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">Services</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Local Delivery</li>
              <li>Regional Transport</li>
              <li>National Logistics</li>
              <li>Enterprise Solutions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Bhavya Express. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
