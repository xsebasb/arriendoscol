'use client';

import React, { useState, useEffect } from 'react';
import LeafletMap from '@/components/LeafletMap';
import { Building2, ShieldAlert } from 'lucide-react';

export default function MapaPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllMapData() {
      try {
        const [resProp, resShelter] = await Promise.all([
          fetch('/api/properties?limit=200'),
          fetch('/api/shelters'),
        ]);
        const propData = await resProp.json();
        const shelterData = await resShelter.json();

        setProperties(Array.isArray(propData?.data) ? propData.data : []);
        setShelters(Array.isArray(shelterData) ? shelterData : []);
      } catch (err) {
        console.error(err);
        setProperties([]);
        setShelters([]);
      } finally {
        setLoading(false);
      }
    }
    loadAllMapData();
  }, []);

  const markers = [
    ...properties.map((p) => ({
      id: p.id,
      title: p.title,
      lat: p.latitude,
      lng: p.longitude,
      type: 'PROPERTY' as const,
      price: p.price,
      city: `${p.municipality}, ${p.department}`,
      image: p.images?.[0] ? `data:${p.images[0].mimeType};base64,${p.images[0].base64}` : undefined,
      link: `/viviendas/${p.id}`,
    })),
    ...shelters.map((s) => ({
      id: s.id,
      title: s.name,
      lat: s.latitude,
      lng: s.longitude,
      type: 'SHELTER' as const,
      city: `${s.municipality}, ${s.department}`,
      image: s.images?.[0] ? `data:${s.images[0].mimeType};base64,${s.images[0].base64}` : undefined,
      link: `/refugios/${s.id}`,
    })),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-black text-white">Mapa Nacional Interactivo</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualización en tiempo real de viviendas (verde) y refugios de atención inmediata (rojo).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">Viviendas ({properties.length})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-300 font-medium">Refugios ({shelters.length})</span>
          </div>
        </div>
      </div>

      <div className="h-[650px] w-full">
        {loading ? (
          <div className="w-full h-full bg-slate-900 animate-pulse rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500 text-sm">
            Cargando mapa interactivo...
          </div>
        ) : (
          <LeafletMap markers={markers} zoom={6} />
        )}
      </div>
    </div>
  );
}
