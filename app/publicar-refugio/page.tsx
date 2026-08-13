'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import LeafletMap from '@/components/LeafletMap';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { COLOMBIA_LOCATIONS, getMunicipalitiesByDepartment, getNeighborhoods } from '@/lib/locationData';
import { ShieldAlert, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PublicarRefugioPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: 'Chocó',
    municipality: 'Quibdó',
    neighborhood: '',
    address: '',
    totalCapacity: '50',
    availableCapacity: '50',
    services: 'Colchones, Alimentación, Atención Médica, Agua Potable',
    phone: '',
    email: '',
    latitude: 5.6947,
    longitude: -76.6611,
  });

  const [images, setImages] = useState<{ base64: string; mimeType: string; isPrimary: boolean }[]>([]);

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
      const res = await fetch('/api/shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Ocurrió un error al publicar el refugio.');
      }

      const created = await res.json();
      router.push(`/refugios/${created.id}`);
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
          <ShieldAlert className="w-8 h-8 text-rose-400" />
          <span>Habilitar / Publicar Refugio de Emergencia</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Registra un punto de acogida humanitaria para brindar apoyo rápido a los damnificados.
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-rose-400 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl">
        {/* Basic info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            1. Datos del Refugio
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Refugio / Albergue *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Centro de Acogida Temporal Quibdó Norte"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacidad Total (personas) *</label>
              <input
                type="number"
                required
                value={formData.totalCapacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCapacity: e.target.value,
                    availableCapacity: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Capacidad Disponible Actual *</label>
              <input
                type="number"
                required
                value={formData.availableCapacity}
                onChange={(e) => setFormData({ ...formData, availableCapacity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Servicios prestados (separados por coma)
              </label>
              <input
                type="text"
                placeholder="Ej. Colchones, Comida caliente, Primeros Auxilios, Baños"
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Observaciones</label>
              <textarea
                rows={3}
                placeholder="Horarios de atención, requerimientos especiales o donaciones recibidas..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            2. Ubicación del Albergue
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
                placeholder="Ej. Zona Norte"
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
                placeholder="Ej. Transversal 5 # 12-34"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span className="font-semibold flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-rose-400" />
                Coordenadas en Mapa (arrastra el PIN)
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

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            3. Fotos del Refugio
          </h3>
          <ImageUploader images={images} onChange={setImages} maxImages={5} />
        </div>

        {/* Emergency Contacts */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
            4. Teléfono & Contacto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono de atención *</label>
              <input
                type="text"
                required
                placeholder="Ej. 3110000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Institucional (Opcional)</label>
              <input
                type="email"
                placeholder="albergue@emergencias.gov.co"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start space-x-2 pt-2 border-t border-slate-800">
          <input
            type="checkbox"
            id="acceptTermsRefugio"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-800 focus:ring-0 mt-0.5 cursor-pointer"
          />
          <label htmlFor="acceptTermsRefugio" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
            Acepto los{' '}
            <a href="/terminos" target="_blank" className="text-rose-400 font-semibold underline">
              Términos y Condiciones
            </a>{' '}
            y autorizo el registro público de los datos de contacto para atención humanitaria.
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting || !acceptTerms}
          className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl text-base transition shadow-xl shadow-rose-950/40 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span>Habilitando refugio...</span>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Habilitar Refugio de Emergencia</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
