import React from 'react';

interface SearchCardProps {
  search: {
    id: string;
    title: string;
    municipality: string;
    type: string;
    neighborhood?: string | null;
    stratum?: string | null;
    bedroomsNeeded: number;
    budget: number;
    needsParking: boolean;
    description: string;
    contactName: string;
    contactPhone: string;
  };
}

export default function SearchCard({ search }: SearchCardProps) {
  return (
    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-cyan-500/40 transition duration-300">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 uppercase tracking-wider">
            {search.type} • {search.municipality}
          </span>
          {search.needsParking && (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              🚗 Con Parqueadero
            </span>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-white leading-snug">{search.title}</h3>
          {search.neighborhood && (
            <p className="text-xs text-slate-400 mt-0.5">
              Barrio preferido: <span className="text-slate-200 font-medium">{search.neighborhood}</span>
            </p>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          {search.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px] text-slate-300 text-center bg-slate-900/40 rounded-lg">
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Habitaciones</span>
            <span className="font-bold text-white">{search.bedroomsNeeded} Hab</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Estrato</span>
            <span className="font-bold text-white">{search.stratum || 'Cualquiera'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px] uppercase">Contacto</span>
            <span className="font-bold text-slate-200 truncate block">{search.contactName}</span>
          </div>
        </div>
      </div>

      {/* Budget & Contact Button */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-semibold">Presupuesto</span>
          <span className="text-base font-black text-emerald-400">
            ${new Intl.NumberFormat('es-CO').format(search.budget)}
          </span>
        </div>

        <a
          href={`https://wa.me/57${search.contactPhone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-950/40 flex items-center space-x-1"
        >
          <span>Contactar</span>
        </a>
      </div>
    </div>
  );
}
