'use client';

import React, { useState, useEffect } from 'react';
import SearchCard from '@/components/SearchCard';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { COLOMBIA_LOCATIONS, getMunicipalitiesByDepartment } from '@/lib/locationData';

export default function BusquedasPage() {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [type, setType] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const fetchSearches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (municipality) params.append('municipality', municipality);
      if (type) params.append('type', type);

      const res = await fetch(`/api/searches?${params.toString()}`);
      let data = await res.json();
      data = Array.isArray(data) ? data : [];

      // Filter by department municipalities if department is selected
      if (department) {
        const deptMuns = getMunicipalitiesByDepartment(department).map((m) => m.name.toLowerCase());
        data = data.filter((item: any) => deptMuns.includes((item.municipality || '').toLowerCase()));
      }

      if (maxBudget) {
        data = data.filter((item: any) => item.budget <= parseFloat(maxBudget));
      }

      setSearches(data);
    } catch (err) {
      console.error(err);
      setSearches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, [department, municipality, type]);

  const availableMunicipalities = department ? getMunicipalitiesByDepartment(department) : [];

  const handleReset = () => {
    setDepartment('');
    setMunicipality('');
    setType('');
    setMaxBudget('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
          Muro de Búsqueda Activa Nacional
        </span>
        <h1 className="text-3xl font-black text-white mt-1">Personas buscando arriendo</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explora lo que arrendatarios andan buscando en cada ciudad y contáctalos directamente por WhatsApp.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-cyan-400 text-sm font-semibold">
            <Filter className="w-4 h-4" />
            <span>Filtros de búsqueda</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de inmueble</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="">Todos los tipos</option>
              <option value="APARTAMENTO">Apartamento</option>
              <option value="CASA">Casa</option>
              <option value="HABITACION">Habitación</option>
              <option value="APARTAESTUDIO">Apartaestudio</option>
            </select>
          </div>

          {/* Max Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Presupuesto máx (COP)</label>
            <input
              type="number"
              placeholder="Ej. 1500000"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
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
      ) : searches.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <p className="text-base font-bold text-white">No hay solicitudes de búsqueda registradas con estos filtros.</p>
          <button onClick={handleReset} className="text-xs text-cyan-400 underline font-semibold">
            Limpiar filtros de búsqueda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searches.map((s) => (
            <SearchCard key={s.id} search={s} />
          ))}
        </div>
      )}
    </div>
  );
}
