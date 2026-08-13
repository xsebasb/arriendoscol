import React from 'react';
import Link from 'next/link';
import { Building2, Heart, ShieldAlert, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">ArriendosCol</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma colombiana directa para conectar personas con viviendas disponibles en arriendo y refugios habilitados en zonas prioritarias de emergencia.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Publicaciones</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/viviendas" className="hover:text-emerald-400 transition">Ver Viviendas</Link>
              </li>
              <li>
                <Link href="/refugios" className="hover:text-rose-400 transition">Ver Refugios</Link>
              </li>
              <li>
                <Link href="/mapa" className="hover:text-cyan-400 transition">Mapa Interactivo</Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-emerald-400 transition font-medium text-slate-300">Términos y Condiciones</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Regions */}
          <div>
            <h4 className="text-white font-semibold mb-3">Zonas Clave</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cali (Valle del Cauca)</span>
              </li>
              <li className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pereira (Risaralda)</span>
              </li>
              <li className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Manizales (Caldas)</span>
              </li>
              <li className="flex items-center space-x-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Quibdó (Chocó)</span>
              </li>
            </ul>
          </div>

          {/* Publish CTA */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-white font-semibold text-xs flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>¿Tienes espacio disponible?</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Publica tu vivienda o habilita un refugio sin requisitos ni registros complicados.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link href="/publicar-vivienda" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-1.5 text-center text-xs rounded-lg transition">
                Publicar Vivienda
              </Link>
              <Link href="/publicar-refugio" className="bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium py-1.5 text-center text-xs rounded-lg transition">
                Publicar Refugio
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ArriendosCol — Viviendas y Refugios en Colombia.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Construido para rápida publicación y ayuda comunitaria</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
