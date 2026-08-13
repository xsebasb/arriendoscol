'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  markers: {
    id: string;
    title: string;
    lat: number;
    lng: number;
    type: 'PROPERTY' | 'SHELTER';
    price?: number;
    city: string;
    image?: string;
    link: string;
  }[];
  center?: [number, number];
  zoom?: number;
  interactivePicker?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLat?: number;
  selectedLng?: number;
}

export default function LeafletMapClient({
  markers,
  center = [4.5709, -74.2973], // Colombia center
  zoom = 6,
  interactivePicker = false,
  onLocationSelect,
  selectedLat,
  selectedLng,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);
  const onLocationSelectRef = useRef(onLocationSelect);

  // Keep callback ref updated to avoid map re-initialization
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Initial map setup effect (runs once on mount)
  useEffect(() => {
    const mapContainer = document.getElementById('leaflet-map-container');
    if (!mapContainer || mapRef.current) return;

    // Fix icon assets
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const initialCenter: [number, number] = selectedLat && selectedLng ? [selectedLat, selectedLng] : center;
    const map = L.map('leaflet-map-container').setView(initialCenter, zoom);
    mapRef.current = map;

    L.tileLayer(process.env.NEXT_PUBLIC_MAP_PROVIDER || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (interactivePicker) {
      const pickerMarker = L.marker(initialCenter, { draggable: true }).addTo(map);
      pickerMarkerRef.current = pickerMarker;

      pickerMarker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        if (onLocationSelectRef.current) {
          onLocationSelectRef.current(position.lat, position.lng);
        }
      });

      map.on('click', (e) => {
        if (pickerMarkerRef.current) {
          pickerMarkerRef.current.setLatLng(e.latlng);
          if (onLocationSelectRef.current) {
            onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
          }
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        pickerMarkerRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Effect to update picker marker position when selectedLat/selectedLng change from autocomplete
  useEffect(() => {
    if (interactivePicker && pickerMarkerRef.current && mapRef.current && selectedLat && selectedLng) {
      const newPos: [number, number] = [selectedLat, selectedLng];
      pickerMarkerRef.current.setLatLng(newPos);
      mapRef.current.panTo(newPos, { animate: true });
    }
  }, [selectedLat, selectedLng, interactivePicker]);

  // Effect to render regular non-picker markers (catalog/details/map pages)
  useEffect(() => {
    if (!mapRef.current || interactivePicker) return;
    const map = mapRef.current;

    // Custom icons
    const propertyIcon = L.divIcon({
      className: 'custom-leaflet-icon-property',
      html: `<div style="background-color: #10b981; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">🏠</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const shelterIcon = L.divIcon({
      className: 'custom-leaflet-icon-shelter',
      html: `<div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; items-center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">🆘</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    markers.forEach((m) => {
      const markerInstance = L.marker([m.lat, m.lng], {
        icon: m.type === 'PROPERTY' ? propertyIcon : shelterIcon,
      }).addTo(map);

      const priceFormatted = m.price
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(m.price)
        : '';

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 200px;">
          ${m.image ? `<img src="${m.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />` : ''}
          <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a;">${m.title}</h4>
          <p style="margin: 2px 0; font-size: 12px; color: #475569;">📍 ${m.city}</p>
          ${priceFormatted ? `<p style="margin: 2px 0; font-size: 13px; font-weight: 700; color: #16a34a;">${priceFormatted}/mes</p>` : ''}
          <a href="${m.link}" style="display: inline-block; margin-top: 6px; padding: 4px 10px; background-color: #0284c7; color: white; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">Ver detalles</a>
        </div>
      `;

      markerInstance.bindPopup(popupContent);
    });
  }, [markers, interactivePicker]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden shadow-inner border border-slate-800">
      <div id="leaflet-map-container" className="w-full h-full min-h-[350px] z-10" />
    </div>
  );
}
