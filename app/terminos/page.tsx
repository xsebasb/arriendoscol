import React from 'react';
import { ShieldCheck, FileText, Lock, AlertTriangle } from 'lucide-react';

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-5 h-5" />
          <span>Protección Legal & Política de Privacidad</span>
        </div>
        <h1 className="text-3xl font-black text-white">Términos y Condiciones de Uso — ArriendosCol</h1>
        <p className="text-xs text-slate-400">Última actualización: 13 de Agosto de 2026</p>
      </div>

      {/* Main Legal Content */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>1. Naturaleza del Servicio y Ausencia de Intermediación</span>
          </h2>
          <p>
            <strong>ArriendosCol</strong> es una plataforma tecnológica comunitaria independiente diseñada exclusivamente para facilitar la conexión directa entre personas que buscan y ofrecen viviendas en arriendo y albergues de emergencia en Colombia. 
            ArriendosCol <strong>no es una inmobiliaria, no actúa como intermediario comercial, no cobra comisiones</strong> y no participa en la negociación, firma de contratos o acuerdos de arrendamiento entre los usuarios.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>2. Autorización de Publicación de Datos Personales y de Contacto</span>
          </h2>
          <p>
            Al publicar cualquier anuncio de vivienda, refugio, aviso de calle o solicitud de búsqueda en ArriendosCol, el usuario autoriza de manera voluntaria, previa y explícita la divulgación pública de los datos de contacto suministrados (incluyendo nombre, número telefónico/WhatsApp y correo electrónico).
          </p>
          <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong>Protección de datos (Ley 1581 de 2012 / Habeas Data):</strong> El usuario declara ser el titular o contar con la autorización del titular de los datos personales e imágenes subidas. Se prohíbe terminantemente la publicación de datos sensibles de terceros sin su consentimiento previo.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>3. Exoneración de Responsabilidad Legal</span>
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
            <li>
              <strong>Veracidad de la Información:</strong> Los usuarios son 100% responsables por la exactitud, veracidad y legalidad de las fotos, precios, características e inmuebles publicados. ArriendosCol no garantiza la autenticidad de las ofertas.
            </li>
            <li>
              <strong>Tratos Comerciales:</strong> ArriendosCol no se hace responsable por estafas, incumplimientos de pagos, daños a inmuebles o disputas legales derivadas de los contactos establecidos a través de la plataforma.
            </li>
            <li>
              <strong>Imágenes de Avisos de Calle:</strong> Los avisos de la calle subidos por la comunidad son material informativo de colaboración ciudadana. ArriendosCol moderará el contenido pero no se responsabiliza por avisos desactualizados o inexactos.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Moderación y Eliminación de Contenidos</h2>
          <p>
            El equipo de administración de ArriendosCol se reserva el derecho absoluto de ocultar o eliminar sin previo aviso cualquier publicación que sea reportada por la comunidad, contenga información falsa, engañosa, lenguaje ofensivo o vulnere derechos de terceros.
          </p>
        </section>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 text-center">
          Al marcar la casilla de aceptación en nuestros formularios, confirmas que has leído, entendido y aceptado todos los puntos estipulados en este documento.
        </div>
      </div>
    </div>
  );
}
