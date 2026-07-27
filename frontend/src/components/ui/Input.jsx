import React from 'react';

export const Input = ({ label, error, ...props }) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[var(--color-text)] opacity-80">{label}</label>}
      <input
        className={`w-full rounded-lg border bg-[var(--color-bg)] text-[var(--color-text)] border-[var(--color-border)] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 animate-fade-in">{error}</span>
      )}
    </div>
  );
};
