'use client';

import React, { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { COLOMBIA_LOCATIONS, getMunicipalitiesByDepartment } from '@/lib/locationData';

export default function ViviendasPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [sort, setSort] = useState('recent');

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{ total: number; totalPages: number; limit: number }>({
    total: 0,
    totalPages: 1,
    limit: 12,
  });

  const fetchProperties = async (targetPage = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', targetPage.toString());
      if (department) params.append('department', department);
      if (municipality) params.append('municipality', municipality);
      if (type) params.append('type', type);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (bedrooms) params.append('bedrooms', bedrooms);
      if (bathrooms) params.append('bathrooms', bathrooms);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();
      setProperties(data.data || []);
      if (data.meta) {
        setMeta(data.meta);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchProperties(1);
  }, [department, municipality, type, sort]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    setPage(newPage);
    fetchProperties(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const availableMunicipalities = department ? getMunicipalitiesByDepartment(department) : [];

  const handleReset = () => {
    setDepartment('');
    setMunicipality('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    setSort('recent');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Viviendas disponibles para arriendo</h1>
          <p className="text-sm text-slate-400 mt-1">
            Encuentra opciones habitacionales verificadas en todo el territorio colombiano.
          </p>
        </div>
        {meta.total > 0 && (
          <span className="self-start sm:self-auto bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full">
            {meta.total} publicaciones en total
          </span>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 text-emerald-400 text-sm font-semibold">
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos los tipos</option>
              <option value="CASA">Casa</option>
              <option value="APARTAMENTO">Apartamento</option>
              <option value="HABITACION">Habitación</option>
              <option value="APARTAESTUDIO">Apartaestudio</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ordenar por</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="recent">Más recientes</option>
              <option value="price_asc">Menor precio primero</option>
              <option value="price_desc">Mayor precio primero</option>
            </select>
          </div>
        </div>

        {/* Price Range & Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Precio mínimo (COP)</label>
            <input
              type="number"
              placeholder="Ej. 300000"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Precio máximo (COP)</label>
            <input
              type="number"
              placeholder="Ej. 2000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Habitaciones mín</label>
            <input
              type="number"
              placeholder="Ej. 2"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setPage(1);
                fetchProperties(1);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition flex items-center justify-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Aplicar Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <p className="text-base font-bold text-white">No se encontraron viviendas con los filtros seleccionados.</p>
          <button
            onClick={handleReset}
            className="text-xs text-emerald-400 underline font-semibold"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          {/* Pagination Bar */}
          {meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Página <strong className="text-white">{page}</strong> de <strong className="text-white">{meta.totalPages}</strong> ({meta.total} resultados)
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Anterior
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                    .filter((pNum) => pNum === 1 || pNum === meta.totalPages || Math.abs(pNum - page) <= 2)
                    .map((pNum, idx, arr) => {
                      const prev = arr[idx - 1];
                      const showEllipsis = prev && pNum - prev > 1;

                      return (
                        <React.Fragment key={pNum}>
                          {showEllipsis && <span className="text-xs text-slate-600 px-1">...</span>}
                          <button
                            onClick={() => handlePageChange(pNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                              page === pNum
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {pNum}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === meta.totalPages}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
