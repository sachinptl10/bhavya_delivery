import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  'Booked',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered'
];

export const StatusTimeline = ({ currentStatus, statusHistory = [] }) => {
  const currentStepIndex = steps.indexOf(currentStatus);

  return (
    <div className="w-full py-8 overflow-hidden">
      <div className="relative flex flex-col md:flex-row justify-between md:items-start items-start px-4">
        {/* Background line - vertical for mobile, horizontal for desktop */}
        <div className="absolute left-[31px] md:left-[10%] top-8 bottom-8 w-[2px] md:w-[80%] md:h-[2px] md:top-[31px] bg-gray-200 z-0"></div>

        {/* Active animated line */}
        <div className="absolute left-[31px] md:left-[10%] top-8 bottom-8 w-[2px] md:w-[80%] md:h-[2px] md:top-[31px] z-0 overflow-hidden">
          <motion.div
            className="w-full h-full bg-[var(--color-primary)] origin-top md:origin-left"
            initial={{ scaleY: 0, scaleX: 0 }}
            animate={{
              scaleY: window.innerWidth < 768 ? (currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) : 0) : 1,
              scaleX: window.innerWidth >= 768 ? (currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) : 0) : 1
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;
          
          const historyItem = statusHistory.find(h => h.status === step);
          const timestamp = historyItem ? new Date(historyItem.timestamp).toLocaleString() : null;

          return (
            <div key={step} className="relative z-10 flex flex-row md:flex-col items-start md:items-center mb-10 md:mb-0 group w-full md:w-1/5">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? 'var(--color-primary)' : '#e5e7eb',
                  borderColor: isCompleted ? '#ffffff' : '#e5e7eb',
                  scale: isActive ? [1, 1.15, 1] : 1
                }}
                transition={isActive ? { repeat: Infinity, duration: 2 } : { duration: 0.3 }}
                className={`w-8 h-8 rounded-full border-4 flex items-center justify-center shrink-0 ${isCompleted ? 'text-white shadow-md' : 'text-gray-400'}`}
              >
                {isCompleted && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </motion.div>
              
              <div className="ml-4 md:ml-0 md:mt-4 flex flex-col md:items-center text-left md:text-center w-full">
                <span className={`font-semibold text-sm ${isCompleted ? 'text-[var(--color-text)]' : 'text-gray-400'}`}>
                  {step}
                </span>
                {timestamp && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="text-xs text-gray-500 mt-1"
                  >
                    {timestamp}
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
