import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

// Lazy-loaded on purpose: lottie-web is heavy and uses eval internally, so it
// is kept out of the main bundle and only fetched when the hero renders.
export const HeroLottie = () => {
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
          .then(r => {
            if (r.ok) return r.json();
            throw new Error('Fallback failed');
          })
          .then(setAnimationData)
          .catch(() => {
            // Silently fail if both Lottie animations are unavailable
          });
      });
  }, []);

  if (!animationData) return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 bg-blue-300/10 rounded-full animate-pulse blur-3xl -z-0 pointer-events-none" />;
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 opacity-20 -z-0 pointer-events-none">
      <Lottie animationData={animationData} loop={true} />
    </motion.div>
  );
};
