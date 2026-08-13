'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LeafletMapClient = dynamic(() => import('./LeafletMapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-medium">
      Cargando mapa interactivo...
    </div>
  ),
});

export default LeafletMapClient;
