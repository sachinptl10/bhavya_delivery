import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', animate = true, ...props }) => {
  const CardWrapper = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-50px' },
        transition: { duration: 0.4, ease: 'easeOut' },
      }
    : {};

  return (
    <CardWrapper
      className={`bg-[var(--color-card)] dark:backdrop-blur-md rounded-xl shadow-sm border border-[var(--color-border)] ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </CardWrapper>
  );
};
