import React from 'react';
import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
};
