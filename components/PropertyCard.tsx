import React from 'react';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize2, CheckCircle2 } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    department: string;
    municipality: string;
    neighborhood: string;
    address?: string;
    images?: { base64: string; mimeType: string; isPrimary: boolean }[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryImg = property.images?.find((img) => img.isPrimary) || property.images?.[0];
  const imageSrc = primaryImg
    ? `data:${primaryImg.mimeType};base64,${primaryImg.base64}`
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const priceFormatted = property.price !== null && property.price !== undefined
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(property.price)
    : 'Por consultar';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
          {property.type}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <span className="text-xl font-black text-white drop-shadow-md">
            {priceFormatted} {property.price ? <span className="text-xs font-normal text-slate-300">/mes</span> : null}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {property.neighborhood || 'Cali'}, {property.municipality} ({property.department})
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
            {property.title}
          </h3>
          {property.address && (
            <p className="text-xs text-slate-400 truncate">
              Dirección: <span className="text-slate-300">{property.address}</span>
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Bed className="w-4 h-4 text-emerald-400" />
            <span>{property.bedrooms !== null && property.bedrooms !== undefined ? `${property.bedrooms} Hab` : 'N/I'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Bath className="w-4 h-4 text-emerald-400" />
            <span>{property.bathrooms !== null && property.bathrooms !== undefined ? `${property.bathrooms} Baños` : 'N/I'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span>{property.area ? `${property.area} m²` : 'N/I'}</span>
          </div>
        </div>

        <Link
          href={`/viviendas/${property.id}`}
          className="w-full bg-slate-800 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white font-semibold py-2.5 rounded-xl text-center text-sm transition duration-300 flex items-center justify-center space-x-2"
        >
          <span>Ver vivienda</span>
          <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
        </Link>
      </div>
    </div>
  );
}
