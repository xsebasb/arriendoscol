'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { COLOMBIA_LOCATIONS } from '@/lib/locationData';
import { Camera, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';

export default function SubirAvisoCalleModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [municipality, setMunicipality] = useState('Pereira');
  const [neighborhood, setNeighborhood] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<{ base64: string; mimeType: string; isPrimary: boolean }[]>([]);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (images.length === 0) {
      setError('Debes adjuntar la foto del aviso de arriendo.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          municipality,
          neighborhood,
          description,
          mimeType: images[0].mimeType,
          base64: images[0].base64,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al enviar la foto del aviso.');
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
        >
          ✕
        </button>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white flex items-center space-x-2">
            <Camera className="w-6 h-6 text-emerald-400" />
            <span>Subir foto de un aviso</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            ¿Viste un aviso de arriendo pegado en la calle? Súbelo aquí para que más gente lo vea. Lo revisamos antes de publicarlo.
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
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">¡Aviso enviado con éxito!</h3>
            <p className="text-xs text-slate-400">Gracias por ayudar a la comunidad.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Foto uploader */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                Foto del aviso *
              </label>
              <ImageUploader images={images} onChange={setImages} maxImages={1} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad *</label>
                <select
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Barrio o sector</label>
                <input
                  type="text"
                  placeholder="Ej: Chipre, cerca a la iglesia"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descripción del lugar (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Calle, puntos de referencia, cualquier detalle que ayude a ubicarlo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex items-start space-x-2 pt-2 border-t border-slate-800">
              <input
                type="checkbox"
                id="acceptTermsNotice"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0 mt-0.5 cursor-pointer"
              />
              <label htmlFor="acceptTermsNotice" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
                Acepto los{' '}
                <a href="/terminos" target="_blank" className="text-emerald-400 font-semibold underline">
                  Términos y Condiciones
                </a>{' '}
                y declaro tener permiso para compartir la foto de este aviso.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !acceptTerms}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-950/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando foto...' : 'Enviar para revisión'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
