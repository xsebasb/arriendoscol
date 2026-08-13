'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelectLocation: (lat: number, lng: number, address: string) => void;
  municipality?: string;
  department?: string;
  placeholder?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelectLocation,
  municipality = '',
  department = '',
  placeholder = 'Ej. Calle 12 # 45-67',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search on Nominatim OpenStreetMap Geocoding API
  useEffect(() => {
    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        // Clean Colombian address syntax for Nominatim geocoder
        // Nominatim performs poorly with '#' or 'No.'. We sanitize 'Calle 8 #23-11' -> 'Calle 8 23 11'
        const cleanedValue = value
          .replace(/#/g, ' ')
          .replace(/-/g, ' ')
          .replace(/No\.?/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        const queryText = `${cleanedValue}, ${municipality ? municipality + ',' : ''} ${department ? department + ',' : ''} Colombia`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText)}&addressdetails=1&limit=6&countrycodes=co`;
        
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'es',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Error autocompletando dirección:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [value, municipality, department]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const displayName = item.display_name;

    onChange(value); // Keep short typed address or user text
    onSelectLocation(lat, lon, displayName);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <Search className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-slate-800">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(item)}
              className="p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-start space-x-2 text-xs text-slate-200"
            >
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-white">{item.display_name}</p>
                <span className="text-[10px] text-slate-400 font-mono">
                  Lat: {parseFloat(item.lat).toFixed(4)} | Lng: {parseFloat(item.lon).toFixed(4)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
