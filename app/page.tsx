'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Building2, ShieldAlert, ChevronRight, ArrowRight, Filter, Sparkles } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import ShelterCard from '@/components/ShelterCard';
import SearchCard from '@/components/SearchCard';
import LeafletMap from '@/components/LeafletMap';
import { COLOMBIA_LOCATIONS } from '@/lib/locationData';

export default function HomePage() {
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [properties, setProperties] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [searches, setSearches] = useState<any[]>([]);
  const [selectedNoticeImage, setSelectedNoticeImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resProp, resShelter, resNotice, resSearch] = await Promise.all([
          fetch('/api/properties?limit=6'),
          fetch('/api/shelters'),
          fetch('/api/notices?status=APROBADO'),
          fetch('/api/searches'),
        ]);
        const propData = await resProp.json();
        const shelterData = await resShelter.json();
        const noticeData = await resNotice.json();
        const searchData = await resSearch.json();

        setProperties(Array.isArray(propData?.data) ? propData.data : []);
        setShelters(Array.isArray(shelterData) ? shelterData : []);
        setNotices(Array.isArray(noticeData) ? noticeData : []);
        setSearches(Array.isArray(searchData) ? searchData : []);
      } catch (err) {
        console.error('Error cargando datos iniciales:', err);
        setProperties([]);
        setShelters([]);
        setNotices([]);
        setSearches([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const mapMarkers = [
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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publicación inmediata y directa en Colombia</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Encuentra un lugar <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">seguro para vivir</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed">
              Conecta con viviendas disponibles y refugios habilitados en las zonas prioritarias y afectadas. Sin intermediarios ni demoras.
            </p>

            {/* Quick Search Bar */}
            <div className="pt-4 max-w-4xl mx-auto">
              <form
                action="/viviendas"
                method="GET"
                className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl shadow-emerald-950/30 backdrop-blur grid grid-cols-1 sm:grid-cols-4 gap-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 text-left mb-1">
                    Municipio / Ciudad
                  </label>
                  <select
                    name="municipality"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Todas las zonas</option>
                    <option value="Cali">Cali (Valle del Cauca)</option>
                    <option value="Pereira">Pereira (Risaralda)</option>
                    <option value="Manizales">Manizales (Caldas)</option>
                    <option value="Quibdó">Quibdó (Chocó)</option>
                    <option value="Bogotá">Bogotá D.C.</option>
                    <option value="Medellín">Medellín (Antioquia)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 text-left mb-1">
                    Tipo de inmueble
                  </label>
                  <select
                    name="type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Todos los tipos</option>
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                    <option value="HABITACION">Habitación</option>
                    <option value="APARTAESTUDIO">Apartaestudio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 text-left mb-1">
                    Precio máximo (COP)
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Ej. 1500000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40"
                  >
                    <Search className="w-4 h-4" />
                    <span>Buscar vivienda</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency & Highlighted Regions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Cobertura Nacional Prioritaria
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Zonas con mayor disponibilidad y atención
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Organización estructurada por Departamento → Municipio → Barrio/Sector para respuesta rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cali */}
          <Link
            href="/viviendas?municipality=Cali"
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-semibold flex items-center">
                Explorar <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Cali</h3>
            <p className="text-xs text-slate-400 mt-1">Valle del Cauca</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-1">
              <span>Siloé, San Fernando, Granada, El Peñón</span>
            </div>
          </Link>

          {/* Pereira */}
          <Link
            href="/viviendas?municipality=Pereira"
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-semibold flex items-center">
                Explorar <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Pereira</h3>
            <p className="text-xs text-slate-400 mt-1">Risaralda</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-1">
              <span>Cuba, Alamos, Pinares, Circunvalar</span>
            </div>
          </Link>

          {/* Manizales */}
          <Link
            href="/viviendas?municipality=Manizales"
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-emerald-400 font-semibold flex items-center">
                Explorar <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Manizales</h3>
            <p className="text-xs text-slate-400 mt-1">Caldas</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-1">
              <span>El Cable, Palermo, Chipre, Alta Suiza</span>
            </div>
          </Link>

          {/* Chocó (Quibdó) */}
          <Link
            href="/viviendas?department=Choc%C3%B3"
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-rose-500/50 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-rose-400 font-semibold flex items-center">
                Explorar <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">Chocó</h3>
            <p className="text-xs text-slate-400 mt-1">Quibdó & Istmina</p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center space-x-1">
              <span>Zona Norte, El Silencio, Reposo</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Viviendas recientes en arriendo</h2>
            <p className="text-xs text-slate-400">Casas, apartamentos y habitaciones disponibles</p>
          </div>
          <Link
            href="/viviendas"
            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Aún no hay viviendas publicadas</h3>
            <p className="text-xs text-slate-400">Sé el primero en ofrecer un espacio seguro para arriendo.</p>
            <Link
              href="/publicar-vivienda"
              className="inline-block bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Publicar Vivienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Community Street Notices */}
      {notices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Comunidad & Avisos Callejeros
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Avisos de arriendo vistos en la calle</h2>
              </div>
              <Link
                href="/avisos-calle"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                <span>Ver todos los avisos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices.slice(0, 3).map((notice) => (
                <div key={notice.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-3 group">
                  <div
                    onClick={() => setSelectedNoticeImage(`data:${notice.mimeType};base64,${notice.base64}`)}
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
          </div>
        </section>
      )}

      {/* Notice Image Lightbox Modal */}
      {selectedNoticeImage && (
        <div
          onClick={() => setSelectedNoticeImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedNoticeImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 text-sm font-bold bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700"
            >
              ✕ Cerrar
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedNoticeImage}
              alt="Aviso ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Community Rental Searches */}
      {searches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  Muro de Búsqueda Activa
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Personas buscando arriendo</h2>
              </div>
              <Link
                href="/busquedas"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
              >
                <span>Ver todas las búsquedas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searches.slice(0, 4).map((search) => (
                <SearchCard key={search.id} search={search} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enabled Shelters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/30 rounded-3xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Atención Humanitaria & Refugios</span>
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Refugios de emergencia habilitados</h2>
            </div>
            <Link
              href="/refugios"
              className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition"
            >
              Ver todos los refugios
            </Link>
          </div>

          {shelters.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay refugios de emergencia registrados actualmente.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelters.slice(0, 3).map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* National Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">Mapa Geoespacial en Vivo</h2>
              <p className="text-xs text-slate-400">Visualiza viviendas (verde) y refugios (rojo) en el territorio nacional.</p>
            </div>
            <Link
              href="/mapa"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Ver mapa pantalla completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[400px]">
            <LeafletMap markers={mapMarkers} />
          </div>
        </div>
      </section>
    </div>
  );
}
