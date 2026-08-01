import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';
import { MapPin, Truck, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router';

export const Services = () => {
  return (
    <PageTransition>
      <div className="bg-[var(--color-bg)] min-h-[calc(100vh-64px)] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Our Services</h1>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
              Choose the delivery speed and coverage that perfectly matches your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Local */}
            <Card className="p-8 flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Local Delivery</h3>
              <p className="text-[var(--color-muted)] mb-6">Same city, lightning fast.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[var(--color-text)]">₹50</span>
                <span className="text-[var(--color-muted)]"> base</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Same day delivery
                </li>
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Point-to-point tracking
                </li>
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Dedicated local riders
                </li>
              </ul>
              <Link to="/create-shipment">
                <Button variant="outline" className="w-full">Book Local</Button>
              </Link>
            </Card>

            {/* Regional */}
            <Card className="p-8 flex flex-col h-full border-2 border-[var(--color-accent)] relative shadow-lg transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-white px-4 py-1 rounded-full text-sm font-bold shadow whitespace-nowrap">
                Most Popular
              </div>
              <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mb-6 mt-2">
                <Truck className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Regional Transport</h3>
              <p className="text-[var(--color-muted)] mb-6">Intra-state, secure routing.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[var(--color-text)]">₹75</span>
                <span className="text-[var(--color-muted)]"> base</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> 1-3 days delivery
                </li>
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Hub-to-hub routing
                </li>
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Priority handling
                </li>
              </ul>
              <Link to="/create-shipment">
                <Button variant="primary" className="w-full animate-glow-pulse">Book Regional</Button>
              </Link>
            </Card>

            {/* National */}
            <Card className="p-8 flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-[var(--color-primary)]" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">National Logistics</h3>
              <p className="text-[var(--color-muted)] mb-6">Cross-country, wide reach.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[var(--color-text)]">₹125</span>
                <span className="text-[var(--color-muted)]"> base</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> 3-7 days delivery
                </li>
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> Air & Surface modes
                </li>
                <li className="flex items-center gap-3 text-[var(--color-muted)]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> 20,000+ pincodes
                </li>
              </ul>
              <Link to="/create-shipment">
                <Button variant="outline" className="w-full">Book National</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
