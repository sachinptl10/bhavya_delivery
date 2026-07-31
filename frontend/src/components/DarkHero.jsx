import React from 'react';
import { Phone, MessageCircle, ArrowRight, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const DarkHero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col bg-[#0a0a0a] text-white font-sans overflow-hidden">
      {/* Import Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .font-anton {
          font-family: 'Anton', sans-serif;
        }
      `}</style>

      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop" 
          alt="Truck on highway at dusk" 
          className="w-full h-full object-cover object-center"
        />
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.85))' }} 
        />
      </div>

      {/* Header/Nav - Internal to Hero */}
      <header className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-white">AANJANA</h1>
          <p className="text-[#a0a0a0] text-xs tracking-widest mt-1 uppercase">Logistics & Transport</p>
        </div>
        <button className="text-white hover:text-[#e8a03d] transition-colors focus:outline-none">
          <Menu className="w-8 h-8" />
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-8 max-w-7xl mx-auto w-full mt-10 md:mt-0">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h2 className="font-anton text-[70px] leading-[0.9] md:text-8xl lg:text-[120px] tracking-wider text-white uppercase drop-shadow-2xl mb-6">
            On The Road <br/>
            At A Time
          </h2>
          
          <p className="text-[#c9c9c9] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-normal">
            With a growing fleet of modern trucks and a nationwide network of city hubs, we ensure your freight reaches its destination safely, efficiently, and on schedule.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="flex items-center justify-center gap-2 bg-[#e8a03d] hover:bg-[#d68b2a] text-black px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 w-full sm:w-auto">
              Get a Freight Quote <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/50 text-white px-6 py-4 rounded-lg font-semibold transition-all hover:bg-white/5">
                <Phone className="w-5 h-5" /> <span className="hidden sm:inline">Talk to</span> Sales
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white/50 text-white px-6 py-4 rounded-lg font-semibold transition-all hover:bg-white/5">
                <MessageCircle className="w-5 h-5" /> WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 bg-[#1a1a1a]/95 backdrop-blur-md border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "4-ton", label: "Trucks Available" },
            { value: "25-ton", label: "Eichers Fleet" },
            { value: "50+", label: "City Hubs" },
            { value: "100%", label: "India Reach" }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className={`p-6 md:p-8 text-center flex flex-col items-center justify-center border-white/10
                ${idx % 2 === 0 ? 'border-r' : ''} 
                ${idx < 2 ? 'border-b md:border-b-0' : ''}
                md:border-r last:border-r-0`}
            >
              <span className="text-[#e8a03d] text-4xl md:text-5xl font-bold mb-2 font-anton tracking-wider">{stat.value}</span>
              <span className="text-[#a0a0a0] text-xs md:text-sm font-medium uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
