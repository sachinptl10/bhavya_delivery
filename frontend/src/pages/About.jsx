import React from 'react';
import { PageTransition } from '../components/PageTransition';
import { Card } from '../components/ui/Card';

export const About = () => {
  return (
    <PageTransition>
      <div className="bg-[var(--color-bg)] min-h-[calc(100vh-64px)] py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4 sm:mb-6">About Us</h1>
            <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
              Driven by a mission to connect every pincode in India through reliable, lightning-fast logistics.
            </p>
          </div>

          <Card className="overflow-hidden mb-10 sm:mb-16">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto order-first md:order-last">
                <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1000&auto=format&fit=crop" alt="Logistics Professional" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-4">The Founder's Story</h2>
                <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
                  [Placeholder Text] Bhavya Express was founded by Bhavya with a simple but ambitious goal: to make logistics accessible, transparent, and incredibly fast for businesses and individuals alike. What started as a small local operation has rapidly expanded into a Pan-India network.
                </p>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  [Placeholder Text] Believing that technology could solve the chaotic nature of traditional courier services, Bhavya built a platform where anyone could book a shipment in seconds and track it in real-time, bringing peace of mind to thousands of customers every day.
                </p>
              </div>
            </div>
          </Card>

          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6 sm:mb-8 text-center">Our Milestones</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--color-primary)] before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--color-bg)] bg-[var(--color-primary)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold">1</span>
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6">
                <div className="text-[var(--color-accent)] font-bold mb-1">2020 (Placeholder)</div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">Company Founded</h3>
                <p className="text-[var(--color-muted)] text-sm mt-2">Started operations in a single city with 5 delivery partners.</p>
              </Card>
            </div>
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--color-bg)] bg-[var(--color-primary)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold">2</span>
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6">
                <div className="text-[var(--color-accent)] font-bold mb-1">2022 (Placeholder)</div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">Regional Expansion</h3>
                <p className="text-[var(--color-muted)] text-sm mt-2">Expanded to cover 500+ pincodes across multiple states.</p>
              </Card>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--color-bg)] bg-[var(--color-primary)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-bold">3</span>
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6">
                <div className="text-[var(--color-accent)] font-bold mb-1">2024 (Placeholder)</div>
                <h3 className="text-lg font-bold text-[var(--color-text)]">Pan-India Network</h3>
                <p className="text-[var(--color-muted)] text-sm mt-2">Achieved 20,000+ pincodes coverage with fully digital tracking.</p>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};
