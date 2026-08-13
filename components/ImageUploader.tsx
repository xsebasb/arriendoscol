'use client';

import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  images: { base64: string; mimeType: string; isPrimary: boolean }[];
  onChange: (images: { base64: string; mimeType: string; isPrimary: boolean }[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject('El archivo debe ser una imagen válida.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // HTML5 Canvas resize & compress
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 960;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('No se pudo procesar la imagen.');
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const parts = compressedDataUrl.split(',');
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const base64 = parts[1];

          resolve({ base64, mimeType: mime });
        };
        img.onerror = () => reject('Error al decodificar la imagen');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Error al leer el archivo');
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setError(null);
    setLoading(true);

    const filesArr = Array.from(e.target.files);
    const availableSlots = maxImages - images.length;
    const selectedFiles = filesArr.slice(0, availableSlots);

    try {
      const processed = await Promise.all(selectedFiles.map(processFile));
      const newImages = [...images];

      processed.forEach((item, idx) => {
        const isPrimary = newImages.length === 0 && idx === 0;
        newImages.push({
          base64: item.base64,
          mimeType: item.mimeType,
          isPrimary: isPrimary
        });
      });

      onChange(newImages);
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Error procesando las imágenes.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-200">
          Imágenes ({images.length}/{maxImages})
        </label>
        <span className="text-xs text-slate-400">
          Se compresión automática a Base64 JPEG
        </span>
      </div>

      {/* Upload Zone */}
      {images.length < maxImages && (
        <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition text-center group">
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 mb-2 transition" />
          <span className="text-sm font-medium text-slate-300 group-hover:text-white">
            {loading ? 'Comprimiendo imagenes...' : 'Haz clic para seleccionar imágenes'}
          </span>
          <span className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP de hasta 10MB</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
          />
        </label>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden border ${
                img.isPrimary ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800'
              } bg-slate-900 group aspect-video`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:${img.mimeType};base64,${img.base64}`}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 p-2">
                <button
                  type="button"
                  onClick={() => setPrimary(index)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center ${
                    img.isPrimary ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Marcar como imagen principal"
                >
                  <Check className="w-3.5 h-3.5 mr-1" />
                  {img.isPrimary ? 'Principal' : 'Principal'}
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition"
                  title="Eliminar imagen"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {img.isPrimary && (
                <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
