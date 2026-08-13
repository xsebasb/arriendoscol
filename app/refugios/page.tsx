'use client';

import React, { useState, useEffect } from 'react';
import ShelterCard from '@/components/ShelterCard';
import { ShieldAlert, Filter, RotateCcw } from 'lucide-react';
import { COLOMBIA_LOCATIONS, getMunicipalitiesByDepartment } from '@/lib/locationData';

export default function RefugiosPage() {
  const [shelters, setShelters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [status, setStatus] = useState('');

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (department) params.append('department', department);
      if (municipality) params.append('municipality', municipality);
      if (status) params.append('status', status);

      const res = await fetch(`/api/shelters?${params.toString()}`);
      const data = await res.json();
      setShelters(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setShelters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [department, municipality, status]);

  const availableMunicipalities = department ? getMunicipalitiesByDepartment(department) : [];

  const handleReset = () => {
    setDepartment('');
    setMunicipality('');
    setStatus('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-900/40 p-6 sm:p-8 rounded-3xl space-y-2">
        <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4" />
          <span>Atención Humanitaria Directa</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Refugios de emergencia habilitados
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Consulta la red nacional de refugios temporales y centros de acogida con disponibilidad de cupos y servicios integrales para damnificados.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            <span>Filtrar Refugios</span>
          </span>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estado del refugio</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">Todos los estados</option>
              <option value="HABILITADO">Habilitado con cupos</option>
              <option value="LLENO">Capacidad llena</option>
              <option value="TEMPORALMENTE_CERRADO">Temporalmente cerrado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : shelters.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <p className="text-base font-bold text-white">No hay refugios registrados en este momento para la ubicación seleccionada.</p>
          <button onClick={handleReset} className="text-xs text-rose-400 font-semibold underline">
            Ver todos los refugios habilitados
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shelters.map((s) => (
            <ShelterCard key={s.id} shelter={s} />
          ))}
        </div>
      )}
    </div>
  );
}
