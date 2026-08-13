'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, MapPin, Building2, ShieldAlert, PlusCircle, Menu, X, Camera, Search, ShieldCheck, Heart, Copy, Check } from 'lucide-react';
import SubirAvisoCalleModal from './SubirAvisoCalleModal';
import BuscarArriendoModal from './BuscarArriendoModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <>
      {/* Top Donation Banner Badge */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-rose-950 border-b border-slate-800 text-[11px] text-slate-300 py-1.5 px-4 text-center flex items-center justify-center space-x-2">
        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse shrink-0" />
        <span className="truncate">
          <strong>Donaciones comunitarias:</strong> Nequi <span className="text-emerald-400 font-bold">3156147381</span> | Bre-b <span className="text-emerald-400 font-bold">@JBN910</span>
        </span>
        <button
          onClick={() => setShowDonationModal(true)}
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-[10px] ml-2 shrink-0 transition"
        >
          Ver detalles de Donación
        </button>
      </div>

      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  ArriendosCol
                </span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase -mt-1">
                  Viviendas & Refugios
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs">
              <Link
                href="/"
                className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inicio</span>
              </Link>
              <Link
                href="/viviendas"
                className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Viviendas</span>
              </Link>
              <Link
                href="/refugios"
                className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Refugios</span>
              </Link>
              <Link
                href="/mapa"
                className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mapa</span>
              </Link>
              <button
                onClick={() => setShowNoticeModal(true)}
                className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg font-medium text-amber-300 hover:text-amber-200 hover:bg-slate-800 transition"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Subir Aviso Calle</span>
              </button>
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg font-medium text-cyan-300 hover:text-cyan-200 hover:bg-slate-800 transition"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Busco Arriendo</span>
              </button>
            </nav>

            {/* Quick Publish Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/publicar-vivienda"
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-emerald-900/30 transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publicar Vivienda</span>
              </Link>
              <Link
                href="/publicar-refugio"
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-rose-200 border border-rose-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Publicar Refugio</span>
              </Link>
            </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Inicio
          </Link>
          <Link
            href="/viviendas"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Viviendas disponibles
          </Link>
          <Link
            href="/refugios"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Refugios habilitados
          </Link>
          <Link
            href="/mapa"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Mapa Interactivo
          </Link>
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowNoticeModal(true);
              }}
              className="block w-full text-center bg-amber-500/20 text-amber-300 font-semibold py-2 rounded-lg border border-amber-500/30 text-sm"
            >
              📷 Subir Aviso de Calle
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setShowSearchModal(true);
              }}
              className="block w-full text-center bg-cyan-500/20 text-cyan-300 font-semibold py-2 rounded-lg border border-cyan-500/30 text-sm"
            >
              🔍 Publicar lo que ando buscando
            </button>
            <Link
              href="/publicar-vivienda"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg text-sm"
            >
              Publicar Vivienda
            </Link>
            <Link
              href="/publicar-refugio"
              onClick={() => setIsMenuOpen(false)}
              className="block text-center w-full bg-slate-800 text-rose-400 font-semibold py-2 rounded-lg border border-rose-500/30 text-sm"
            >
              Publicar Refugio
            </Link>
          </div>
        </div>
      )}
    </header>

    <SubirAvisoCalleModal
      isOpen={showNoticeModal}
      onClose={() => setShowNoticeModal(false)}
    />
    <BuscarArriendoModal
      isOpen={showSearchModal}
      onClose={() => setShowSearchModal(false)}
    />

    {/* Donation Modal */}
    {showDonationModal && (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
          <button
            onClick={() => setShowDonationModal(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
          >
            ✕
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
            <h2 className="text-xl font-black text-white">Apoya a la Plataforma & Refugios</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Las donaciones son destinadas 100% al mantenimiento técnico del servidor y la compra de insumos de primera necesidad para los refugios temporales de emergencias.
            </p>
          </div>

          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Nequi</span>
                <span className="text-sm font-black text-emerald-400 font-mono">3156147381</span>
              </div>
              <button
                onClick={() => copyToClipboard('3156147381', 'nequi')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                title="Copiar número"
              >
                {copiedKey === 'nequi' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Llave Bre-b</span>
                <span className="text-sm font-black text-emerald-400 font-mono">@JBN910</span>
              </div>
              <button
                onClick={() => copyToClipboard('@JBN910', 'breb')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                title="Copiar llave Bre-b"
              >
                {copiedKey === 'breb' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center italic">
            ¡Muchas gracias por tu solidaridad y contribución con la comunidad colombiana!
          </p>
        </div>
      </div>
    )}
    </>
  );
}
