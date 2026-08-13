import React from 'react';
import Link from 'next/link';
import { MapPin, Users, Phone, ShieldAlert, CheckCircle } from 'lucide-react';

interface ShelterCardProps {
  shelter: {
    id: string;
    name: string;
    description: string;
    department: string;
    municipality: string;
    neighborhood: string;
    address: string;
    totalCapacity: number;
    availableCapacity: number;
    services: string;
    status: string;
    phone: string;
    images?: { base64: string; mimeType: string; isPrimary: boolean }[];
  };
}

export default function ShelterCard({ shelter }: ShelterCardProps) {
  const primaryImg = shelter.images?.find((img) => img.isPrimary) || shelter.images?.[0];
  const imageSrc = primaryImg
    ? `data:${primaryImg.mimeType};base64,${primaryImg.base64}`
    : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';

  const statusColors: Record<string, string> = {
    HABILITADO: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    LLENO: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    CERRADO: 'bg-slate-700/50 text-slate-400 border-slate-600',
    TEMPORALMENTE_CERRADO: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  };

  const statusLabels: Record<string, string> = {
    HABILITADO: 'Habilitado',
    LLENO: 'Lleno',
    CERRADO: 'Cerrado',
    TEMPORALMENTE_CERRADO: 'Temp. Cerrado',
  };

  const capacityPct = Math.round(
    ((shelter.totalCapacity - shelter.availableCapacity) / shelter.totalCapacity) * 100
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/20 transition duration-300 flex flex-col group">
      {/* Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={shelter.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur ${
            statusColors[shelter.status] || 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          {statusLabels[shelter.status] || shelter.status}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            🆘 Refugio de Emergencia
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">
              {shelter.neighborhood}, {shelter.municipality} ({shelter.department})
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition line-clamp-1">
            {shelter.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {shelter.description}
          </p>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300 flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>Cupos disponibles</span>
            </span>
            <span className="text-emerald-400 font-bold">
              {shelter.availableCapacity} / {shelter.totalCapacity}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                shelter.availableCapacity > 0 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, 100 - capacityPct))}%` }}
            />
          </div>
        </div>

        {/* Services tag list */}
        {shelter.services && (
          <div className="flex flex-wrap gap-1">
            {shelter.services.split(',').slice(0, 3).map((service, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50"
              >
                ✓ {service.trim()}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/refugios/${shelter.id}`}
          className="w-full bg-slate-800 group-hover:bg-rose-600 text-slate-200 group-hover:text-white font-semibold py-2.5 rounded-xl text-center text-sm transition duration-300 flex items-center justify-center space-x-2"
        >
          <span>Ver refugio y contacto</span>
          <Phone className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
