'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Users, Phone, Mail, ShieldAlert, CheckCircle2, Share2, Check } from 'lucide-react';
import LeafletMap from '@/components/LeafletMap';

export default function DetalleRefugioPage() {
  const params = useParams();
  const id = params.id as string;

  const [shelter, setShelter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchShelter() {
      try {
        const res = await fetch(`/api/shelters/${id}`);
        if (res.ok) {
          const data = await res.json();
          setShelter(data);
          if (data.images && data.images.length > 0) {
            const primary = data.images.find((img: any) => img.isPrimary) || data.images[0];
            setSelectedImage(`data:${primary.mimeType};base64,${primary.base64}`);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchShelter();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Cargando detalles del refugio...</p>
      </div>
    );
  }

  if (!shelter) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Refugio no encontrado</h2>
        <p className="text-xs text-slate-400">Es posible que la publicación haya finalizado o cambiado de estado.</p>
      </div>
    );
  }

  const imagesArr = shelter.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-rose-400 font-semibold mb-1">
            <span className="bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full uppercase">
              {shelter.status}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {shelter.neighborhood}, {shelter.municipality} ({shelter.department})
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">{shelter.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Dirección: {shelter.address}</p>
        </div>

        <div className="flex flex-col md:items-end">
          <div className="text-2xl font-black text-emerald-400 flex items-center space-x-1">
            <Users className="w-6 h-6 mr-1" />
            <span>{shelter.availableCapacity} disponibles</span>
          </div>
          <span className="text-xs text-slate-400">Capacidad total: {shelter.totalCapacity} personas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Gallery */}
          <div className="space-y-4">
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative">
              {selectedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selectedImage} alt={shelter.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  Sin imágenes disponibles
                </div>
              )}
            </div>

            {imagesArr.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {imagesArr.map((img: any, idx: number) => {
                  const src = `data:${img.mimeType};base64,${img.base64}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(src)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 ${
                        selectedImage === src ? 'border-rose-500' : 'border-slate-800'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white">Información general del refugio</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {shelter.description || 'Sin descripción adicional.'}
            </p>
          </div>

          {/* Services offered */}
          {shelter.services && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Servicios disponibles</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shelter.services.split(',').map((serv: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">{serv.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Location */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-rose-400" />
                <span>Ubicación en Mapa</span>
              </h3>
              <div className="flex items-center space-x-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 shadow"
                >
                  <span>🗺️ Abrir Google Maps</span>
                </a>
                <a
                  href={`https://waze.com/ul?ll=${shelter.latitude},${shelter.longitude}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 shadow"
                >
                  <span>🚗 Abrir Waze</span>
                </a>
              </div>
            </div>
            <div className="h-80">
              <LeafletMap
                center={[shelter.latitude, shelter.longitude]}
                zoom={14}
                markers={[
                  {
                    id: shelter.id,
                    title: shelter.name,
                    lat: shelter.latitude,
                    lng: shelter.longitude,
                    type: 'SHELTER',
                    city: shelter.municipality,
                    link: `#`,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Contact */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Contacto de Atención</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Teléfono del refugio</span>
                  <a
                    href={`https://wa.me/57${shelter.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-rose-400 hover:underline"
                  >
                    {shelter.phone}
                  </a>
                </div>
              </div>

              {shelter.email && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Correo institucional</span>
                    <span className="text-xs font-semibold text-slate-200">{shelter.email}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/57${shelter.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-center text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/40"
              >
                <Phone className="w-4 h-4" />
                <span>Contactar por WhatsApp</span>
              </a>

              <button
                onClick={handleShare}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? '¡Enlace copiado!' : 'Compartir ubicación de refugio'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
