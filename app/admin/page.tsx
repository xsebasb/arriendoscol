'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Camera,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Lock,
  LogOut,
  AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'viviendas' | 'refugios' | 'avisos' | 'busquedas' | 'reportes'>('viviendas');

  // Login Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [submittingLogin, setSubmittingLogin] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const resData = await res.json();
        setData(resData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setSubmittingLogin(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Credenciales incorrectas');
      }

      await loadAdminData();
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
      setIsAuthenticated(false);
      setData(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Vivienda/Refugio Status & Delete
  const handlePropertyStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNoticeStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm('¿Eliminar aviso de calle permanentemente?')) return;
    try {
      const res = await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSearch = async (id: string) => {
    if (!confirm('¿Eliminar solicitud de búsqueda permanentemente?')) return;
    try {
      const res = await fetch(`/api/searches/${id}`, { method: 'DELETE' });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !data && !loginError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-400 text-sm">
        Cargando panel de administración integral...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Acceso Administrativo Privado</h1>
            <p className="text-xs text-slate-400">Ingresa tus credenciales autorizadas para continuar.</p>
          </div>

          {loginError && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl text-rose-400 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Usuario Administrativo</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={submittingLogin}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              {submittingLogin ? 'Verificando...' : 'Iniciar Sesión Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Panel de Administración Integral</h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisa, edita estado, aprueba avisos callejeros y gestiona solicitudes de búsqueda de arriendos.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <button
          onClick={() => setActiveTab('viviendas')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'viviendas'
              ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Building2 className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Viviendas</span>
          </div>
          <span className="text-2xl font-black text-white">{data?.stats?.totalProperties || 0}</span>
        </button>

        <button
          onClick={() => setActiveTab('refugios')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'refugios'
              ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2 text-rose-400 mb-1">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Refugios</span>
          </div>
          <span className="text-2xl font-black text-white">{data?.stats?.totalShelters || 0}</span>
        </button>

        <button
          onClick={() => setActiveTab('avisos')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'avisos'
              ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <Camera className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Avisos Calle</span>
          </div>
          <span className="text-2xl font-black text-white">{data?.stats?.totalNotices || 0}</span>
        </button>

        <button
          onClick={() => setActiveTab('busquedas')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'busquedas'
              ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2 text-cyan-400 mb-1">
            <Search className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Búsquedas</span>
          </div>
          <span className="text-2xl font-black text-white">{data?.stats?.totalSearches || 0}</span>
        </button>

        <button
          onClick={() => setActiveTab('reportes')}
          className={`p-4 rounded-2xl border text-left transition ${
            activeTab === 'reportes'
              ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center space-x-2 text-purple-400 mb-1">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Reportes</span>
          </div>
          <span className="text-2xl font-black text-white">{data?.stats?.totalReports || 0}</span>
        </button>
      </div>

      {/* Tab Navigation Content */}

      {/* TAB 1: VIVIENDAS */}
      {activeTab === 'viviendas' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>Gestión de Viviendas Publicadas</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Título / Dirección</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Estado Actual</th>
                  <th className="p-3 text-right">Acciones de Edición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.properties?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-950/50">
                    <td className="p-3">
                      <p className="font-bold text-white">{p.title}</p>
                      <span className="text-[11px] text-slate-400">{p.address}</span>
                    </td>
                    <td className="p-3">{p.municipality}, {p.department}</td>
                    <td className="p-3 font-bold text-emerald-400">
                      ${new Intl.NumberFormat('es-CO').format(p.price)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'DISPONIBLE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <a
                        href={`/viviendas/${p.id}`}
                        target="_blank"
                        className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </a>
                      <button
                        onClick={() =>
                          handlePropertyStatus(p.id, p.status === 'DISPONIBLE' ? 'ARRENDADO' : 'DISPONIBLE')
                        }
                        className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-amber-500/30"
                      >
                        <span>Cambiar a {p.status === 'DISPONIBLE' ? 'ARRENDADO' : 'DISPONIBLE'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REFUGIOS */}
      {activeTab === 'refugios' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Gestión de Refugios de Emergencia</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Refugio</th>
                  <th className="p-3">Ubicación</th>
                  <th className="p-3">Capacidad Disp.</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3 text-right">Ver Ficha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.shelters?.map((s: any) => (
                  <tr key={s.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-white">{s.name}</td>
                    <td className="p-3">{s.municipality}, {s.department}</td>
                    <td className="p-3 font-bold text-emerald-400">{s.availableCapacity} / {s.totalCapacity}</td>
                    <td className="p-3 text-slate-400">{s.phone}</td>
                    <td className="p-3 text-right">
                      <a
                        href={`/refugios/${s.id}`}
                        target="_blank"
                        className="inline-flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Ficha</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AVISOS DE LA CALLE */}
      {activeTab === 'avisos' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <span>Avisos de Arriendo en la Calle (Moderación & Aprobar)</span>
          </h3>

          {data?.notices?.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay avisos de calle subidos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.notices?.map((n: any) => (
                <div key={n.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4 space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:${n.mimeType};base64,${n.base64}`}
                      alt="Aviso calle"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{n.municipality}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        n.status === 'APROBADO'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : n.status === 'RECHAZADO'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    {n.neighborhood && <p className="text-xs text-slate-300">Barrio: {n.neighborhood}</p>}
                    {n.description && <p className="text-xs text-slate-400 italic leading-relaxed">{n.description}</p>}
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleNoticeStatus(n.id, 'APROBADO')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center space-x-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Aprobar</span>
                    </button>
                    <button
                      onClick={() => handleNoticeStatus(n.id, 'RECHAZADO')}
                      className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Rechazar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNotice(n.id)}
                      className="p-1.5 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SOLICITUDES DE BÚSQUEDA */}
      {activeTab === 'busquedas' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <span>Personas Buscando Arriendo (Anuncios de Solicitud)</span>
          </h3>

          {data?.searches?.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay solicitudes de búsqueda registradas.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data?.searches?.map((s: any) => (
                <div key={s.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative group">
                  <button
                    onClick={() => handleDeleteSearch(s.id)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition"
                    title="Eliminar solicitud"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 uppercase">
                      {s.type} • {s.municipality}
                    </span>
                    <h4 className="text-base font-bold text-white pt-1">{s.title}</h4>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-300">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Presupuesto</span>
                      <span className="font-bold text-emerald-400">${new Intl.NumberFormat('es-CO').format(s.budget)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Habitaciones</span>
                      <span className="font-bold text-white">{s.bedroomsNeeded} Hab</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Contacto</span>
                      <span className="font-bold text-white">{s.contactName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Teléfono / WA</span>
                      <a href={`tel:${s.contactPhone}`} className="font-bold text-cyan-400 hover:underline">{s.contactPhone}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REPORTES */}
      {activeTab === 'reportes' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>Reportes de la Comunidad</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Motivo</th>
                  <th className="p-3">Detalles</th>
                  <th className="p-3">Publicación</th>
                  <th className="p-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data?.reports?.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-rose-400">{r.reason}</td>
                    <td className="p-3 text-slate-400">{r.details || 'Sin detalles'}</td>
                    <td className="p-3">
                      {r.property ? (
                        <a href={`/viviendas/${r.property.id}`} className="text-emerald-400 underline" target="_blank">
                          {r.property.title}
                        </a>
                      ) : r.shelter ? (
                        <a href={`/refugios/${r.shelter.id}`} className="text-rose-400 underline" target="_blank">
                          {r.shelter.name}
                        </a>
                      ) : (
                        'General'
                      )}
                    </td>
                    <td className="p-3 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
