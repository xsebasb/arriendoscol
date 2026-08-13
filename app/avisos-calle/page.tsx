'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Filter, RotateCcw, Sparkles } from 'lucide-react';
import { COLOMBIA_LOCATIONS, getMunicipalitiesByDepartment } from '@/lib/locationData';

export default function AvisosCallePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter States
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices?status=APROBADO');
      let data = await res.json();
      data = Array.isArray(data) ? data : [];

      if (municipality) {
        data = data.filter((item: any) => item.municipality.toLowerCase() === municipality.toLowerCase());
      } else if (department) {
        const deptMuns = getMunicipalitiesByDepartment(department).map((m) => m.name.toLowerCase());
        data = data.filter((item: any) => deptMuns.includes((item.municipality || '').toLowerCase()));
      }

      setNotices(data);
    } catch (err) {
      console.error(err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [department, municipality]);

  const availableMunicipalities = department ? getMunicipalitiesByDepartment(department) : [];

  const handleReset = () => {
    setDepartment('');
    setMunicipality('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Galería de Comunidad & Colaboración
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Avisos de arriendo en la calle</h1>
        <p className="text-sm text-slate-400 mt-1">
          Avisos físicos capturados por la comunidad en distintas ciudades de Colombia. Haz clic en cualquier imagen para ampliarla.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-amber-400 text-sm font-semibold">
            <Filter className="w-4 h-4" />
            <span>Filtros por ubicación</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Departamento</label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setMunicipality('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">Todos los departamentos</option>
              {COLOMBIA_LOCATIONS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Municipality */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Municipio / Ciudad</label>
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              disabled={!department}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white disabled:opacity-50"
            >
              <option value="">Todos los municipios</option>
              {availableMunicipalities.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <p className="text-base font-bold text-white">No hay avisos callejeros subidos con estos filtros.</p>
          <button onClick={handleReset} className="text-xs text-amber-400 underline font-semibold">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 group">
              <div
                onClick={() => setSelectedImage(`data:${notice.mimeType};base64,${notice.base64}`)}
                className="aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:${notice.mimeType};base64,${notice.base64}`}
                  alt="Aviso callejero"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold space-x-1">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ampliar foto</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400">📍 {notice.municipality}</span>
                {notice.neighborhood && <p className="text-xs text-slate-300 font-semibold">{notice.neighborhood}</p>}
                {notice.description && <p className="text-xs text-slate-400 mt-1 italic">{notice.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 text-sm font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700"
            >
              ✕ Cerrar
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Aviso ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
