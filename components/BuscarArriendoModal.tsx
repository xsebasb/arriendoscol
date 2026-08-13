'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BuscarArriendoModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    municipality: 'Pereira',
    type: 'APARTAMENTO',
    neighborhood: '',
    stratum: 'Cualquiera',
    bedroomsNeeded: '2',
    budget: '',
    needsParking: false,
    description: '',
    contactName: '',
    contactPhone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Error al registrar la solicitud de búsqueda.');
      }

      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
        >
          ✕
        </button>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <Search className="w-6 h-6 text-rose-400" />
            <span>Buscar arriendo</span>
          </h2>
          <p className="text-xs text-slate-400">
            Publica lo que andas buscando para que propietarios te contacten directamente.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sentSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">¡Solicitud de búsqueda publicada!</h3>
            <p className="text-xs text-slate-400">Los arrendadores podrán ver tu perfil de búsqueda.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Título *</label>
              <input
                type="text"
                required
                placeholder="Ej: Familia de 4 busca apartamento para arrendar"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad *</label>
                <select
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Cali">Cali</option>
                  <option value="Pereira">Pereira</option>
                  <option value="Manizales">Manizales</option>
                  <option value="Quibdó">Quibdó</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de inmueble</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="APARTAMENTO">Apartamento</option>
                  <option value="CASA">Casa</option>
                  <option value="HABITACION">Habitación</option>
                  <option value="APARTAESTUDIO">Apartaestudio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Barrio de preferencia (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: El Cable"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estrato (opcional)</label>
                <select
                  value={formData.stratum}
                  onChange={(e) => setFormData({ ...formData, stratum: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Cualquiera">Cualquiera</option>
                  <option value="1">Estrato 1</option>
                  <option value="2">Estrato 2</option>
                  <option value="3">Estrato 3</option>
                  <option value="4">Estrato 4</option>
                  <option value="5+">Estrato 5 o superior</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habitaciones que necesita</label>
                <input
                  type="number"
                  placeholder="Ej: 2"
                  value={formData.bedroomsNeeded}
                  onChange={(e) => setFormData({ ...formData, bedroomsNeeded: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Presupuesto disponible *</label>
                <input
                  type="number"
                  required
                  placeholder="Ej: 700000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="needsParking"
                checked={formData.needsParking}
                onChange={(e) => setFormData({ ...formData, needsParking: e.target.checked })}
                className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <label htmlFor="needsParking" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Necesita parqueadero
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Describe tu situación</label>
              <textarea
                rows={3}
                placeholder="Cuéntanos qué tipo de apartamento necesitas, por cuánto tiempo, y cualquier detalle relevante."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Gómez"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp / Teléfono *</label>
                <input
                  type="text"
                  required
                  placeholder="3001234567"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                id="acceptTermsSearch"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-800 focus:ring-0 mt-0.5 cursor-pointer"
              />
              <label htmlFor="acceptTermsSearch" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                Acepto los{' '}
                <a href="/terminos" target="_blank" className="text-rose-400 font-semibold underline">
                  Términos y Condiciones
                </a>{' '}
                y autorizo la publicación de mis datos de contacto para recibir ofertas de arriendo.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !acceptTerms}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-rose-950/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? 'Publicando búsqueda...' : 'Publicar búsqueda'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
