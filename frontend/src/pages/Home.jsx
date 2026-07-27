import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/PageTransition';
import { MapPin, Box, Truck, ShieldCheck, ArrowRight, Clock, Home as HomeIcon, CreditCard, Globe, Headphones, Star, ChevronDown, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import api from '../utils/api';

const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "" }) => {
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.floor(value).toLocaleString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration, suffix]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
};

const FaqItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-[var(--color-border)] last:border-0">
    <button
      className="w-full py-4 flex justify-between items-center text-left focus:outline-none"
      onClick={onClick}
    >
      <span className="font-semibold text-[var(--color-text)]">{question}</span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
        <ChevronDown className="w-5 h-5 text-[var(--color-muted)]" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="pb-4 text-[var(--color-muted)]">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const HeroLottie = () => {
  const [animationData, setAnimationData] = useState(null);
  useEffect(() => {
    fetch('https://lottie.host/82df0e61-a08b-402f-b44c-b17b6dc19dc4/QvG1oI5a9v.json') // Delivery truck lottie
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Fallback');
      })
      .then(setAnimationData)
      .catch(() => {
        // Fallback to a known reliable drone/delivery animation if the first fails
        fetch('https://lottie.host/0a9db58a-f5bb-44ab-9c3a-cfef7c7f4262/lU7YjS2P0e.json')
          .then(r => r.json())
          .then(setAnimationData)
          .catch(console.error);
      });
  }, []);

  if (!animationData) return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-blue-300/10 rounded-full animate-pulse blur-3xl -z-0 pointer-events-none" />;
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 opacity-20 -z-0 pointer-events-none">
      <Lottie animationData={animationData} loop={true} />
    </motion.div>
  );
};

export const Home = () => {
  const navigate = useNavigate();
  
  // Pricing Tiers State
  const [tiers, setTiers] = useState([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [tierError, setTierError] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoadingTiers(true);
      const res = await api.get('/pricing-tiers');
      setTiers(res.data);
      setTierError(false);
    } catch (err) {
      console.error('Failed to fetch tiers', err);
      setTierError(true);
    } finally {
      setLoadingTiers(false);
    }
  };

  const iconMap = {
    MapPin: MapPin,
    Truck: Truck,
    Globe: Globe
  };
  // Rate Estimator State
  const [estPickup, setEstPickup] = useState('');
  const [estDrop, setEstDrop] = useState('');
  const [estWeight, setEstWeight] = useState('');
  const [estSpeed, setEstSpeed] = useState('Standard');
  const [estPickupDate, setEstPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [quote, setQuote] = useState(null);

  // Debounced quote calculation
  useEffect(() => {
    if (estPickup.length === 6 && estDrop.length === 6 && estWeight) {
      const base = 50;
      const weightCharge = parseFloat(estWeight) * 20;
      let mult = 1;
      let zone = 'national';
      
      if (estPickup.substring(0,2) === estDrop.substring(0,2)) {
        zone = 'regional';
        mult = 1.5;
      }
      if (estPickup === estDrop) {
        zone = 'local';
        mult = 1;
      }
      
      let price = (base + weightCharge) * mult;
      if (estSpeed === 'Express') price *= 1.5;

      let days = 5;
      if (zone === 'local') days = estSpeed === 'Express' ? 0 : 1;
      else if (zone === 'regional') days = estSpeed === 'Express' ? 2 : 3;
      else if (zone === 'national') days = estSpeed === 'Express' ? 4 : 7;
      
      const baseDate = estPickupDate ? new Date(estPickupDate) : new Date();
      const targetDate = new Date(baseDate);
      targetDate.setDate(targetDate.getDate() + days);
      const isToday = baseDate.toDateString() === new Date().toDateString();
      const dateStr = (days === 0 && isToday) ? 'Today' : targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      setQuote({ price: Math.round(price), zone, dateStr });
    } else {
      setQuote(null);
    }
  }, [estPickup, estDrop, estWeight, estSpeed, estPickupDate]);

  const handleBookEstimate = () => {
    navigate('/create-shipment', {
      state: {
        reorderData: {
          sender: { pincode: estPickup, name: '', phone: '', address: '', city: '', state: '' },
          receiver: { pincode: estDrop, name: '', phone: '', address: '', city: '', state: '' },
          weight: estWeight
        }
      }
    });
  };

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <PageTransition>
      {/* 1. Hero Section (Unchanged) */}
      <section className="relative overflow-hidden bg-[var(--color-bg)] pt-12 pb-32">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HeroLottie />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-primary)] mb-6"
          >
            Deliver Anywhere.<br/>
            <span className="text-[var(--color-accent)]">On Time, Every Time.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-[var(--color-muted)] mb-10 max-w-2xl mx-auto"
          >
            India's most trusted logistics partner. Book your parcel delivery in seconds and track it in real-time across 20,000+ pincodes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/create-shipment">
              <Button variant="primary" className="text-lg px-8 py-4 animate-glow-pulse w-full sm:w-auto flex items-center gap-2">
                Book a Delivery <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto">
                Track Shipment
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 1.5. Professional Marquee Banner (NEW) */}
      <section className="bg-[var(--color-primary)] dark:bg-slate-900 text-white py-3 overflow-hidden border-y border-blue-900/50 shadow-md">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6 text-sm md:text-base font-semibold uppercase tracking-widest">
              <span className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-300" /> 100% Secure Transport</span>
              <span className="text-blue-500/50">|</span>
              <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-300" /> On-Time Guarantee</span>
              <span className="text-blue-500/50">|</span>
              <span className="flex items-center gap-2"><Truck className="w-5 h-5 text-blue-300" /> Nationwide Coverage</span>
              <span className="text-blue-500/50">|</span>
              <span className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-300" /> Real-Time Tracking</span>
              <span className="text-blue-500/50">|</span>
              <span className="flex items-center gap-2"><Box className="w-5 h-5 text-blue-300" /> Trusted by 10,000+ Businesses</span>
              <span className="text-blue-500/50">|</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Trust Stats Bar (NEW) */}
      <section className="py-12 bg-white dark:bg-[var(--color-card)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                <AnimatedCounter to={50000} suffix="+" />
              </div>
              <div className="text-sm text-[var(--color-muted)] font-medium">Deliveries Completed</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                <AnimatedCounter to={20000} suffix="+" />
              </div>
              <div className="text-sm text-[var(--color-muted)] font-medium">Pincodes Served</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                <AnimatedCounter to={4.8} duration={1.5} suffix="★" />
              </div>
              <div className="text-sm text-[var(--color-muted)] font-medium">Average Rating</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                <AnimatedCounter to={500} suffix="+" />
              </div>
              <div className="text-sm text-[var(--color-muted)] font-medium">Delivery Partners</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Live Rate Estimator (NEW) */}
      <section className="py-24 bg-[var(--color-bg)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 sm:p-8 md:p-12 overflow-visible relative border-t-4 border-t-[var(--color-primary)] shadow-2xl">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[var(--color-accent)] rounded-full opacity-10 blur-3xl pointer-events-none"></div>
              
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-primary)]">Quick Rate Estimator</h2>
                <p className="text-[var(--color-muted)] mt-2">Get instant pricing before you book.</p>
              </div>
              
              <div className="bg-white dark:bg-[var(--color-card)] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <Input label="Pickup Date" type="date" value={estPickupDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setEstPickupDate(e.target.value)} />
                  <Input label="Pickup PIN" placeholder="e.g. 400001" maxLength={6} value={estPickup} onChange={(e) => setEstPickup(e.target.value)} />
                  <Input label="Drop PIN" placeholder="e.g. 110001" maxLength={6} value={estDrop} onChange={(e) => setEstDrop(e.target.value)} />
                  <Input label="Weight (kg)" type="number" step="0.1" placeholder="e.g. 2.5" value={estWeight} onChange={(e) => setEstWeight(e.target.value)} />
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <button 
                  onClick={() => setEstSpeed('Standard')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${estSpeed === 'Standard' ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                  <Truck className="w-5 h-5" /> Standard
                </button>
                <button 
                  onClick={() => setEstSpeed('Express')}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${estSpeed === 'Express' ? 'bg-[var(--color-accent)] text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                >
                  <Clock className="w-5 h-5" /> Express
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center border border-blue-100 dark:border-slate-700 min-h-[160px] flex flex-col items-center justify-center transition-all">
                {quote ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full">
                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-primary)] dark:text-blue-400 font-bold mb-2 uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" /> {quote.zone} Delivery
                    </div>
                    <div className="flex items-end justify-center gap-2 mb-2">
                      <span className="text-5xl font-extrabold text-[var(--color-text)]">₹{quote.price}</span>
                      <span className="text-gray-500 font-medium mb-1">total</span>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center justify-center gap-1.5 h-6 relative overflow-visible">
                      <Calendar className="w-4 h-4" /> Estimated Delivery: 
                      <div className="relative inline-block min-w-[100px] text-left">
                        <AnimatePresence mode="popLayout">
                          <motion.span 
                            key={quote.dateStr}
                            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                            transition={{ duration: 0.4, type: 'spring', bounce: 0.4 }}
                            className="absolute left-0 top-0 whitespace-nowrap inline-block"
                          >
                            {quote.dateStr}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                    <Button variant="primary" className="px-10 py-4 text-lg font-bold w-full sm:w-auto rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" onClick={handleBookEstimate}>
                      Book This Shipment Now
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
                    <Box className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm md:text-base font-medium">Enter valid 6-digit pincodes and weight to see your estimate.</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* 4. How it Works Section (Unchanged layout, but part of flow) */}
      <section className="py-24 bg-white dark:bg-[var(--color-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">How it Works</h2>
            <p className="mt-4 text-[var(--color-muted)]">Three simple steps to get your parcel moving.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card className="p-8 text-center group h-full">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Enter Details</h3>
                <p className="text-[var(--color-muted)]">Provide pickup and drop addresses along with parcel weight.</p>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <Card className="p-8 text-center group h-full">
                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Box className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Get Quote & Book</h3>
                <p className="text-[var(--color-muted)]">See instant pricing, complete payment securely, and get a tracking ID.</p>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <Card className="p-8 text-center group h-full">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Track & Relax</h3>
                <p className="text-[var(--color-muted)]">Our agents pick up the parcel while you track it live until delivery.</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us (NEW) */}
      <section className="py-24 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">Why Choose Us</h2>
            <p className="mt-4 text-[var(--color-muted)]">Unmatched reliability and features for modern logistics.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Real-Time Tracking", desc: "Live updates at every step of the journey." },
              { icon: ShieldCheck, title: "Secure Handling", desc: "Premium care for fragile and valuable items." },
              { icon: HomeIcon, title: "Doorstep Pickup", desc: "We come to you. No need to visit a branch." },
              { icon: CreditCard, title: "Affordable Pricing", desc: "Transparent rates with no hidden fees." },
              { icon: Globe, title: "Pan-India Network", desc: "Delivering to 20,000+ pincodes nationwide." },
              { icon: Headphones, title: "24/7 Support", desc: "Always here to help when you need us." },
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <Card className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                    <p className="text-[var(--color-muted)] text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Service Tiers (NEW DYNAMIC) */}
      <section className="py-24 bg-white dark:bg-[var(--color-card)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">Our Services</h2>
            <p className="mt-4 text-[var(--color-muted)]">Flexible delivery options tailored to your needs.</p>
          </div>

          {loadingTiers ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="p-8 flex flex-col h-full rounded-2xl">
                  <Skeleton className="w-14 h-14 rounded-xl mb-6" />
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <Skeleton className="h-10 w-1/3 mb-8" />
                  <div className="space-y-4 mb-8 flex-grow">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-lg mt-auto" />
                </Card>
              ))}
            </div>
          ) : tierError ? (
            <div className="text-center py-12 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-2xl max-w-2xl mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Failed to load pricing</h3>
              <p className="text-red-600 dark:text-red-300 mb-6">We couldn't connect to our pricing servers.</p>
              <Button onClick={fetchTiers} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Try Again</Button>
            </div>
          ) : (
            <motion.div 
              className="flex md:grid md:grid-cols-3 gap-8 w-max md:w-full px-4 md:px-0 mt-12 pb-4 mx-auto cursor-grab active:cursor-grabbing md:cursor-auto"
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.1}
            >
              {tiers.map((tier, idx) => {
                const IconComponent = iconMap[tier.icon] || Box;
                
                return (
                  <motion.div 
                    key={tier._id} 
                    className="w-[85vw] md:w-auto shrink-0 flex"
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: idx * 0.1 }}
                  >
                    <motion.div 
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="w-full flex"
                    >
                      <Card className={`w-full p-8 flex flex-col h-full rounded-2xl transition-shadow duration-300 hover:shadow-xl relative ${tier.isPopular ? 'border-2 border-[var(--color-accent)] md:scale-[1.02] z-10' : ''}`}>
                        {tier.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg whitespace-nowrap uppercase tracking-widest z-20">
                            Most Popular
                          </div>
                        )}
                        
                        <div className="w-14 h-14 bg-blue-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group">
                          <IconComponent className="w-7 h-7 text-[var(--color-primary)] dark:text-blue-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">{tier.name}</h3>
                        <p className="text-[var(--color-muted)] mb-6 text-sm">{tier.description}</p>
                        
                        <div className="mb-8 flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-[var(--color-text)]">₹{tier.basePrice}</span>
                          <span className="text-[var(--color-muted)] text-sm font-medium">base</span>
                        </div>
                        
                        <ul className="space-y-4 mb-8 flex-grow text-[var(--color-muted)] text-sm">
                          {tier.features.map((feat, fidx) => (
                            <li key={fidx} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> 
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <motion.div whileTap={{ scale: 0.96 }} className="mt-auto">
                          <Button 
                            variant={tier.isPopular ? "primary" : "outline"} 
                            className="w-full rounded-xl py-3 font-semibold"
                            onClick={() => navigate('/create-shipment', { state: { tier: tier.name } })}
                          >
                            Select {tier.name.split(' ')[0]}
                          </Button>
                        </motion.div>
                        
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* 7. Testimonials Carousel (NEW) */}
      <section className="py-24 bg-[var(--color-bg)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">What Our Customers Say</h2>
        </div>
        <div className="w-full overflow-hidden flex whitespace-nowrap py-4 group">
          <div className="animate-marquee flex gap-6 px-3 w-max group-hover:[animation-play-state:paused]">
            {[1, 2].map(set => (
              <div key={set} className="flex gap-6">
                {[
                  { name: "Priya Sharma", city: "Mumbai", quote: "Bhavya Express changed how my boutique operates. Deliveries are always on time, and the tracking is incredibly accurate.", initials: "PS" },
                  { name: "Rahul Desai", city: "Ahmedabad", quote: "I've tried many logistics partners, but the Pan-India reach and transparent pricing here is simply unmatched.", initials: "RD" },
                  { name: "Ananya Iyer", city: "Chennai", quote: "The door-to-door pickup is a lifesaver. It saves me hours every week, and my clients love the fast deliveries.", initials: "AI" },
                  { name: "Vikram Singh", city: "Delhi", quote: "Extremely reliable for inter-state transport. My delicate electronics always reach the destination in perfect condition.", initials: "VS" },
                  { name: "Sneha Reddy", city: "Hyderabad", quote: "The Live Rate Estimator is fantastic. I always know exactly what I'll pay before booking. Highly recommended!", initials: "SR" },
                  { name: "Aditya Verma", city: "Pune", quote: "Best customer support I've ever experienced with a courier service. They resolved my query within minutes.", initials: "AV" }
                ].map((testimonial, idx) => (
                  <Card key={`${set}-${idx}`} className="w-80 shrink-0 p-6 whitespace-normal">
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-[var(--color-muted)] italic mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-[var(--color-primary)] dark:text-blue-400 font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-text)]">{testimonial.name}</h4>
                        <p className="text-xs text-[var(--color-muted)]">Verified Shipper, {testimonial.city}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Recent Shipments Ticker (NEW) */}
      <div className="w-full bg-[var(--color-card)] border-y border-[var(--color-border)] overflow-hidden flex whitespace-nowrap py-3">
        <div className="animate-marquee flex text-sm text-[var(--color-muted)] w-max">
          {[1, 2].map(set => (
            <div key={set} className="flex gap-12 px-6">
              <span>📦 Parcel #BHV4821** delivered to Pune</span>
              <span>🚀 New shipment booked from Ahmedabad to Delhi</span>
              <span>✅ Parcel #BHV9384** picked up in Bangalore</span>
              <span>🚚 Regional transit from Mumbai to Surat</span>
              <span>📦 Parcel #BHV1123** delivered to Chennai</span>
              <span>🚀 New shipment booked from Kolkata to Patna</span>
            </div>
          ))}
        </div>
      </div>

      {/* 9. FAQ Accordion (NEW) */}
      <section className="py-24 bg-white dark:bg-[var(--color-bg)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)]">Frequently Asked Questions</h2>
          </div>
          <Card className="px-6 py-2">
            {[
              { q: "How long does delivery take?", a: "Depending on your selected tier, delivery ranges from same-day (Local) to 3-7 days (National)." },
              { q: "How can I track my parcel?", a: "Use the tracking ID provided during booking on our Track Shipment page for real-time updates." },
              { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, and Net Banking securely via Razorpay." },
              { q: "What happens if my parcel is damaged?", a: "We offer full liability coverage for premium shipments. Standard shipments are covered under our basic care policy." },
              { q: "Can I cancel a booked shipment?", a: "Yes, shipments can be cancelled before they are picked up for a full refund." }
            ].map((faq, idx) => (
              <FaqItem 
                key={idx} 
                question={faq.q} 
                answer={faq.a} 
                isOpen={openFaq === idx} 
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)} 
              />
            ))}
          </Card>
        </div>
      </section>

      {/* 10. Coverage Banner (Unchanged, wrapped in motion) */}
      <section className="py-20 bg-[var(--color-primary)] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Delivering to 20,000+ pincodes across India</h2>
              <p className="text-blue-100 text-lg mb-8">From metro cities to remote towns, Bhavya Express ensures your parcel reaches its destination safely and on time.</p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-[var(--color-accent)]" />
                  <span>Secure Handling</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-6 h-6 text-[var(--color-accent)]" />
                  <span>Fast Transit</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11. Final CTA Banner (NEW) */}
      <section className="py-24 bg-[var(--color-accent)] text-white text-center px-4 sm:px-6">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to ship with confidence?</h2>
          <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of individuals and businesses who trust Bhavya Express with their logistics every day.</p>
          <Link to="/create-shipment">
            <Button variant="" className="bg-white text-[var(--color-accent)] hover:bg-gray-100 text-xl px-10 py-5 rounded-full shadow-xl transition-transform hover:scale-105">
              Book a Delivery Now
            </Button>
          </Link>
        </motion.div>
      </section>

    </PageTransition>
  );
};
