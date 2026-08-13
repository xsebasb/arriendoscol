'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Bed, Bath, Maximize2, Phone, Mail, User, Share2, ShieldAlert, Check } from 'lucide-react';
import LeafletMap from '@/components/LeafletMap';

export default function DetalleViviendaPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Información falsa');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty(data);
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
    if (id) fetchProperty();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          details: reportDetails,
          propertyId: id,
        }),
      });
      setReportSent(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSent(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Cargando detalles de la vivienda...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Vivienda no encontrada</h2>
        <p className="text-xs text-slate-400">Es posible que la publicación haya sido retirado u ocultada.</p>
      </div>
    );
  }

  const priceFormatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(property.price);

  const imagesArr = property.images || [];

  const handleToggleStatus = async () => {
    const newStatus = property.status === 'DISPONIBLE' ? 'ARRENDADO' : 'DISPONIBLE';
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProperty((prev: any) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      console.error('Error cambiando estado:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold mb-1">
            <span className="bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase">
              {property.type}
            </span>
            <span>•</span>
            <span className={`px-2.5 py-0.5 rounded-full uppercase font-bold text-[10px] border ${
              property.status === 'DISPONIBLE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {property.status === 'DISPONIBLE' ? 'Disponible' : 'Ya Arrendado / No Disponible'}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {property.neighborhood}, {property.municipality} ({property.department})
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">{property.title}</h1>
          <p className="text-xs text-slate-400 mt-1">Dirección: {property.address}</p>
        </div>

        <div className="flex flex-col md:items-end">
          <span className="text-3xl font-black text-emerald-400">{priceFormatted}</span>
          <span className="text-xs text-slate-400">Valor de arriendo mensual</span>
        </div>
      </div>

      {/* Main Grid: Gallery & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery & Specs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery Component */}
          <div className="space-y-4">
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative">
              {selectedImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  Sin imágenes disponibles
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imagesArr.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {imagesArr.map((img: any, idx: number) => {
                  const src = `data:${img.mimeType};base64,${img.base64}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(src)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 ${
                        selectedImage === src ? 'border-emerald-500' : 'border-slate-800'
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

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center">
            <div className="space-y-1">
              <span className="text-slate-400 text-xs flex items-center justify-center">
                <Bed className="w-4 h-4 mr-1 text-emerald-400" /> Habitaciones
              </span>
              <p className="text-lg font-bold text-white">{property.bedrooms}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs flex items-center justify-center">
                <Bath className="w-4 h-4 mr-1 text-emerald-400" /> Baños
              </span>
              <p className="text-lg font-bold text-white">{property.bathrooms}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs flex items-center justify-center">
                <Maximize2 className="w-4 h-4 mr-1 text-emerald-400" /> Área Total
              </span>
              <p className="text-lg font-bold text-white">{property.area} m²</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-lg font-bold text-white">Descripción del inmueble</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description || 'Sin descripción detallada disponible.'}
            </p>
          </div>

          {/* Map Section */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Ubicación Exacta</span>
              </h3>
              <div className="flex items-center space-x-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center space-x-1 shadow"
                >
                  <span>🗺️ Abrir Google Maps</span>
                </a>
                <a
                  href={`https://waze.com/ul?ll=${property.latitude},${property.longitude}&navigate=yes`}
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
                center={[property.latitude, property.longitude]}
                zoom={14}
                markers={[
                  {
                    id: property.id,
                    title: property.title,
                    lat: property.latitude,
                    lng: property.longitude,
                    type: 'PROPERTY',
                    price: property.price,
                    city: property.municipality,
                    link: `#`,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Contact & Actions */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Información de Contacto
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Propietario / Contacto</span>
                  <span className="text-sm font-bold text-white">{property.contactName}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Teléfono / WhatsApp</span>
                  <a
                    href={`https://wa.me/57${property.contactPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-emerald-400 hover:underline"
                  >
                    {property.contactPhone}
                  </a>
                </div>
              </div>

              {property.contactEmail && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Correo electrónico</span>
                    <span className="text-xs font-semibold text-slate-200">{property.contactEmail}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/57${property.contactPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-center text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40"
              >
                <Phone className="w-4 h-4" />
                <span>Contactar por WhatsApp</span>
              </a>

              {/* Toggle Availability Button */}
              <button
                onClick={handleToggleStatus}
                className={`w-full font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2 border ${
                  property.status === 'DISPONIBLE'
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                <span>
                  {property.status === 'DISPONIBLE'
                    ? 'Marcar como "Ya Arrendado"'
                    : 'Marcar como "Disponible"'}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition flex items-center justify-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? '¡Enlace copiado!' : 'Compartir publicación'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="w-full text-xs text-rose-400 hover:text-rose-300 font-medium py-2 flex items-center justify-center space-x-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Reportar publicación</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <span>Reportar Publicación</span>
            </h3>

            {reportSent ? (
              <p className="text-xs text-emerald-400 font-semibold py-4 text-center">
                ¡Gracias! Tu reporte ha sido registrado con éxito.
              </p>
            ) : (
              <form onSubmit={handleReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo del reporte</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Información falsa">Información falsa</option>
                    <option value="Ubicación incorrecta">Ubicación incorrecta</option>
                    <option value="Precio incorrecto">Precio incorrecto</option>
                    <option value="Duplicada">Duplicada</option>
                    <option value="Contenido inapropiado">Contenido inapropiado</option>
                    <option value="Otro">Otro motivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Detalles adicionales</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Escribe brevemente la irregularidad..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="w-1/2 bg-slate-800 text-slate-300 py-2 rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-rose-600 text-white font-bold py-2 rounded-xl text-xs"
                  >
                    Enviar Reporte
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
