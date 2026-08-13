'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import LeafletMap from '@/components/LeafletMap';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { COLOMBIA_LOCATIONS, getMunicipalitiesByDepartment, getNeighborhoods } from '@/lib/locationData';
import { MapPin, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PublicarViviendaPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'APARTAMENTO',
    price: '',
    bedrooms: '1',
    bathrooms: '1',
    area: '',
    department: 'Valle del Cauca',
    municipality: 'Cali',
    neighborhood: '',
    address: '',
    latitude: 3.4516,
    longitude: -76.5320,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const [images, setImages] = useState<{ base64: string; mimeType: string; isPrimary: boolean }[]>([]);

  // Location Cascading
  const municipalities = getMunicipalitiesByDepartment(formData.department);

  const handleDepartmentChange = (deptName: string) => {
    const muns = getMunicipalitiesByDepartment(deptName);
    const firstMun = muns[0] || { name: '', lat: 4.5709, lng: -74.2973 };

    setFormData({
      ...formData,
      department: deptName,
      municipality: firstMun.name,
      neighborhood: '',
      latitude: firstMun.lat,
      longitude: firstMun.lng,
    });
  };

  const handleMunicipalityChange = (munName: string) => {
    const mun = municipalities.find((m) => m.name === munName);
    setFormData({
      ...formData,
      municipality: munName,
      neighborhood: '',
      latitude: mun ? mun.lat : formData.latitude,
      longitude: mun ? mun.lng : formData.longitude,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ocurrió un error al guardar la publicación.');
      }

      const created = await res.json();
      router.push(`/viviendas/${created.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-emerald-400" />
          <span>Publicar Vivienda para Arriendo</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Publica de inmediato sin requerir contraseñas o registros previos.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            1. Información del Inmueble
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título descriptivo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Casa iluminada de 3 habitaciones en Siloé"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Inmueble *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              >
                <option value="APARTAMENTO">Apartamento</option>
                <option value="CASA">Casa</option>
                <option value="HABITACION">Habitación</option>
                <option value="APARTAESTUDIO">Apartaestudio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Precio Mensual (COP) *</label>
              <input
                type="number"
                required
                placeholder="Ej. 850000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Habitaciones</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Baños</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Área (m²)</label>
              <input
                type="number"
                placeholder="Ej. 65"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción detallada</label>
              <textarea
                rows={4}
                placeholder="Incluye detalles de servicios, estado de la vivienda, acceso a transporte público..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            2. Ubicación Exacta
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Departamento *</label>
              <select
                value={formData.department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              >
                {COLOMBIA_LOCATIONS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Municipio *</label>
              <select
                value={formData.municipality}
                onChange={(e) => handleMunicipalityChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              >
                {municipalities.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Barrio / Sector *</label>
              <input
                type="text"
                required
                placeholder="Ej. Siloé / San Fernando"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dirección física * (Escribe para autocompletar y situar el PIN en el mapa)
              </label>
              <AddressAutocomplete
                value={formData.address}
                onChange={(address) => setFormData({ ...formData, address })}
                onSelectLocation={(lat, lng, fullAddress) => {
                  setFormData({
                    ...formData,
                    address: formData.address || fullAddress,
                    latitude: lat,
                    longitude: lng,
                  });
                }}
                department={formData.department}
                municipality={formData.municipality}
                placeholder="Ej. Calle 13f # 65-33"
              />
            </div>
          </div>

          {/* Interactive Coordinates Picker */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="font-semibold flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-emerald-400" />
                Ubica el PIN en el mapa exacto (arrastra el marcador)
              </span>
              <span className="text-slate-400 font-mono">
                Lat: {formData.latitude.toFixed(4)} | Lng: {formData.longitude.toFixed(4)}
              </span>
            </div>

            <div className="h-72">
              <LeafletMap
                center={[formData.latitude, formData.longitude]}
                zoom={13}
                interactivePicker={true}
                selectedLat={formData.latitude}
                selectedLng={formData.longitude}
                onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
                markers={[]}
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            3. Galería de Imágenes
          </h3>
          <ImageUploader images={images} onChange={setImages} maxImages={5} />
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            4. Datos de Contacto Directo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de contacto *</label>
              <input
                type="text"
                required
                placeholder="Ej. Carlos Pérez"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="Ej. 3001234567"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo (Opcional)</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start space-x-2 pt-2 border-t border-slate-800">
          <input
            type="checkbox"
            id="acceptTermsVivienda"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0 mt-0.5 cursor-pointer"
          />
          <label htmlFor="acceptTermsVivienda" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
            Acepto los{' '}
            <a href="/terminos" target="_blank" className="text-emerald-400 font-semibold underline">
              Términos y Condiciones
            </a>{' '}
            y autorizo la divulgación de los datos de contacto suministrados para la publicación de la vivienda.
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || !acceptTerms}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-base transition shadow-xl shadow-emerald-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span>Guardando e indexando vivienda...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Publicar Vivienda Ahora</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
