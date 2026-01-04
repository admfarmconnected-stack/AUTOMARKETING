
import React, { useState, useEffect } from 'react';
import { Car, Banner } from '../types';

interface HomeProps {
  cars: Car[];
  banners: Banner[];
  onCarClick: (car: Car) => void;
}

export const Home: React.FC<HomeProps> = ({ cars, banners, onCarClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'Tudo' | 'Carro' | 'Moto'>('Tudo');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Tudo' || car.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-[60px] overflow-hidden bg-gray-900 py-28 px-8 text-center shadow-2xl">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-gray-900/95"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
            ESTOQUE <span className="text-blue-500">PREMIUM</span>
          </h1>
          
          <div className="relative max-w-2xl mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Digite o modelo que você procura..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-7 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all text-xl font-medium shadow-2xl"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {['Tudo', 'Carro', 'Moto'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as any)}
                className={`px-8 py-3 rounded-full font-black uppercase text-sm transition-all ${
                  categoryFilter === cat 
                    ? 'bg-blue-600 text-white scale-110 shadow-xl' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat === 'Tudo' ? 'Todos Veículos' : cat + 's'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Vantagens Automarketing */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-500">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-white/20 group-hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2 group-hover:text-white uppercase tracking-tighter">Anúncio Verificado</h3>
          <p className="text-gray-500 text-sm group-hover:text-blue-100 font-medium">Todos os veículos passam por curadoria rigorosa antes da publicação, garantindo procedência.</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-500">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-white/20 group-hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2 group-hover:text-white uppercase tracking-tighter">Alta Visibilidade</h3>
          <p className="text-gray-500 text-sm group-hover:text-blue-100 font-medium">Sua oferta alcança milhares de compradores qualificados em toda a região.</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-500">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-white/20 group-hover:text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-black mb-2 group-hover:text-white uppercase tracking-tighter">Negócio Direto</h3>
          <p className="text-gray-500 text-sm group-hover:text-blue-100 font-medium">Sem intermediários ocultos. Você fala diretamente com o responsável pelo veículo.</p>
        </div>
      </section>

      {/* Banner Carousel */}
      {banners.length > 0 && (
        <section className="bg-white p-3 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="relative h-48 md:h-56 overflow-hidden rounded-[30px]">
            {banners.map((banner, index) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === activeBannerIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-110'}`}
              >
                <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block h-full relative">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.partnerName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                  <div className="absolute bottom-8 left-10 text-left">
                    <span className="text-blue-400 font-black text-xs uppercase tracking-widest mb-1 block">Parceiro Oficial</span>
                    <h3 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">{banner.partnerName}</h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Grid of Vehicles */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">
              Vitrine <span className="text-blue-600">Digital</span>
            </h2>
            <p className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-[0.3em]">Qualidade Automarketing</p>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-blue-600 font-black text-sm uppercase">
               {filteredCars.length} Veículos em estoque
             </span>
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[60px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">Nenhum veículo encontrado</p>
            <button onClick={() => {setSearchTerm(''); setCategoryFilter('Tudo')}} className="mt-4 text-blue-600 font-bold hover:underline">Limpar filtros</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCars.map(car => (
              <div 
                key={car.id}
                onClick={() => onCarClick(car)}
                className="group bg-white rounded-[50px] overflow-hidden shadow-lg hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={car.images[0]} 
                    alt={car.model}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 font-black px-4 py-2 rounded-2xl text-[10px] uppercase shadow-xl">
                      {car.year}
                    </span>
                    <span className="bg-blue-600 text-white font-black px-4 py-2 rounded-2xl text-[10px] uppercase shadow-xl w-fit">
                      {car.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <h3 className="text-3xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors uppercase truncate leading-none tracking-tighter">
                    {car.model}
                  </h3>
                  <p className="text-gray-400 font-bold text-xs uppercase mb-6 tracking-widest">{car.location}</p>
                  
                  <div className="mt-auto">
                    <p className="text-4xl font-black text-green-600 mb-8 leading-none">
                      {formatCurrency(car.price)}
                    </p>
                    <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                      <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">Ver Detalhes →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Guia de Segurança */}
      <section className="bg-gray-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full"></div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-none">Guia de Compra <span className="text-blue-500">100% Segura</span></h2>
               <p className="text-gray-400 font-medium text-lg mb-10 leading-relaxed">No AUTOMARKETING, sua segurança é prioridade. Siga nossas recomendações para uma negociação tranquila.</p>
               
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-black">01</div>
                     <p className="text-gray-300 font-medium">Nunca faça depósitos de "sinal" ou reserva sem antes ver o veículo pessoalmente.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-black">02</div>
                     <p className="text-gray-300 font-medium">Exija sempre a documentação original e verifique a placa no portal do DETRAN.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0 font-black">03</div>
                     <p className="text-gray-300 font-medium">Dê preferência para realizar a vistoria e o pagamento em locais públicos e seguros.</p>
                  </div>
               </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[40px]">
               <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter text-blue-400">Vantagem AUTOMARKETING</h3>
               <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                     <span className="font-bold">Anunciantes Qualificados</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                     <span className="font-bold">Fotos de Alta Resolução</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                     <span className="font-bold">Histórico de Confiança</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                     <span className="font-bold">Suporte Direto Especializado</span>
                  </li>
               </ul>
               <button onClick={() => window.scrollTo(0,0)} className="w-full mt-10 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-black uppercase text-sm shadow-xl transition-all">Ver Estoque Agora</button>
            </div>
         </div>
      </section>
    </div>
  );
};
