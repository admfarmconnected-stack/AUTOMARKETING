
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-20 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
                AM
              </div>
              <span className="text-2xl font-black tracking-tighter">
                AUTO<span className="text-blue-500">MARKETING</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg max-w-md">
              A vitrine digital mais segura do Brasil. Conectamos vendedores honestos a compradores decididos através da curadoria premium de nossa plataforma.
            </p>
            <div className="mt-8 flex gap-4">
               <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl">
                  <span className="block text-blue-500 font-black text-2xl">2000+</span>
                  <span className="text-xs text-gray-500 uppercase font-black">Veículos Postados</span>
               </div>
               <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl">
                  <span className="block text-green-500 font-black text-2xl">100%</span>
                  <span className="text-xs text-gray-500 uppercase font-black">Seguro e Direto</span>
               </div>
            </div>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-500 mb-8">Vantagens</h4>
            <ul className="space-y-4 text-gray-400 font-bold text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Exposição de Alto Nível</li>
              <li className="hover:text-white cursor-pointer transition-colors">Fotos Profissionais</li>
              <li className="hover:text-white cursor-pointer transition-colors">Suporte Anti-Golpe</li>
              <li className="hover:text-white cursor-pointer transition-colors">Anúncio sem Taxas Ocultas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-blue-500 mb-8">Contato Admin</h4>
            <ul className="space-y-4 text-gray-400 font-bold text-sm">
              <li className="text-white">Felipe Silva Automarketing</li>
              <li>Atendimento VIP Especializado</li>
              <li>Segunda a Sábado</li>
              <li className="pt-4">
                 <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Plataforma Protegida</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs font-black uppercase tracking-widest">
          <p>© 2026 AUTOMARKETING - TODOS OS DIREITOS RESERVADOS.</p>
          <div className="flex gap-8">
             <span>Privacidade</span>
             <span>Segurança</span>
             <span>Termos</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
