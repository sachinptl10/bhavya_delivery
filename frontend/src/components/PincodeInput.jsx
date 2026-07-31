import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Crosshair, Loader2, ChevronRight } from 'lucide-react';
import { searchPincodes, findNearestPincode } from '../data/pincodeData';

export const PincodeInput = ({ label, value, onChange, placeholder = 'e.g. 400001', onPincodeSelect, showLocationBtn = false }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Search as user types
  useEffect(() => {
    if (value && value.length >= 1) {
      const results = searchPincodes(value, 6);
      setSuggestions(results);
      setShowDropdown(results.length > 0);
      setHighlightIndex(-1);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('[data-suggestion]');
      if (items[highlightIndex]) {
        items[highlightIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightIndex]);

  const handleSelect = useCallback((item) => {
    onChange({ target: { value: item.pincode } });
    if (onPincodeSelect) onPincodeSelect(item);
    setShowDropdown(false);
    setLocationError('');
  }, [onChange, onPincodeSelect]);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    onChange({ target: { value: val } });
    setLocationError('');
  };

  // GPS Location detection
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('GPS not supported');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestPincode(latitude, longitude);
        
        if (nearest) {
          onChange({ target: { value: nearest.pincode } });
          if (onPincodeSelect) onPincodeSelect(nearest);
          setShowDropdown(false);
        } else {
          setLocationError('No nearby pincode found');
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location unavailable');
            break;
          default:
            setLocationError('Location error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="w-full flex flex-col gap-1 relative" ref={wrapperRef}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text)] opacity-80 flex items-center justify-between">
          <span>{label}</span>
          {showLocationBtn && (
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--color-primary)] hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
              title="Use my current location"
            >
              {isLocating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Crosshair className="w-3 h-3" />
              )}
              {isLocating ? 'Locating...' : 'My Location'}
            </button>
          )}
        </label>
      )}
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="w-full rounded-xl border bg-[var(--color-bg)] text-[var(--color-text)] border-[var(--color-border)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 pr-9 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-gray-600 group-focus-within:text-[var(--color-primary)] transition-colors pointer-events-none" />
      </div>

      {/* Location error */}
      {locationError && (
        <span className="text-[10px] text-red-500 font-medium animate-fade-in">{locationError}</span>
      )}

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[9999] overflow-hidden max-h-[260px] overflow-y-auto"
          style={{
            animation: 'dropdownSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="px-3 py-1.5 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-700">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} found
            </span>
          </div>
          {suggestions.map((item, idx) => (
            <button
              key={item.pincode}
              type="button"
              data-suggestion
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightIndex(idx)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all duration-150 text-sm cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 ${
                idx === highlightIndex
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                idx === highlightIndex
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-[var(--color-primary)]'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[var(--color-text)] flex items-center gap-1.5 text-[13px]">
                  <span className="text-[var(--color-primary)] font-mono tracking-wide">{item.pincode}</span>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="truncate">{item.city}</span>
                </div>
                <div className="text-[11px] text-[var(--color-muted)] truncate">{item.state}</div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-150 ${
                idx === highlightIndex ? 'text-[var(--color-primary)] opacity-100' : 'text-gray-300 opacity-0'
              }`} />
            </button>
          ))}
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
