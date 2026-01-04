
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { Car, Banner, ViewState } from './types';

// Utilitário simples para IndexedDB (Banco de dados de alta capacidade)
const dbName = 'AutoMarketingDB';
const storeName = 'vehicles';
const bannerStore = 'banners';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 2);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(bannerStore)) db.createObjectStore(bannerStore, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [cars, setCars] = useState<Car[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do IndexedDB na inicialização
  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await initDB();
        
        // Carregar Veículos
        const vTx = db.transaction(storeName, 'readonly');
        const vStore = vTx.objectStore(storeName);
        const vRequest = vStore.getAll();
        vRequest.onsuccess = () => {
          setCars(vRequest.result.sort((a: Car, b: Car) => b.createdAt - a.createdAt));
        };

        // Carregar Banners
        const bTx = db.transaction(bannerStore, 'readonly');
        const bStore = bTx.objectStore(bannerStore);
        const bRequest = bStore.getAll();
        bRequest.onsuccess = () => {
          if (bRequest.result.length > 0) {
            setBanners(bRequest.result);
          } else {
            const defaults = [
              { id: '1', imageUrl: 'https://picsum.photos/seed/ads1/1200/200', link: '#', partnerName: 'Seguros Premium' },
              { id: '2', imageUrl: 'https://picsum.photos/seed/ads2/1200/200', link: '#', partnerName: 'Lava Jato VIP' }
            ];
            setBanners(defaults);
          }
          setIsLoading(false);
        };
      } catch (err) {
        console.error("Erro ao carregar banco de dados", err);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddCar = async (newCar: Car) => {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(newCar);
    setCars(prev => [newCar, ...prev]);
  };

  const handleDeleteCar = async (id: string) => {
    const db = await initDB();
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    setCars(prev => prev.filter(c => c.id !== id));
  };

  const handleAddBanner = async (newBanner: Banner) => {
    const db = await initDB();
    const tx = db.transaction(bannerStore, 'readwrite');
    tx.objectStore(bannerStore).put(newBanner);
    setBanners(prev => [newBanner, ...prev]);
  };

  const handleDeleteBanner = async (id: string) => {
    const db = await initDB();
    const tx = db.transaction(bannerStore, 'readwrite');
    tx.objectStore(bannerStore).delete(id);
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleOpenCar = (car: Car) => {
    setSelectedCar(car);
    setView('CAR_DETAIL');
    window.scrollTo(0,0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-gray-900 uppercase tracking-widest">Carregando Vitrine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Navbar currentView={view} setView={setView} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {view === 'HOME' && (
          <Home 
            cars={cars} 
            banners={banners} 
            onCarClick={handleOpenCar} 
          />
        )}
        
        {view === 'ADMIN' && (
          <AdminPortal 
            cars={cars} 
            banners={banners}
            onAddCar={handleAddCar} 
            onDeleteCar={handleDeleteCar}
            onAddBanner={handleAddBanner}
            onDeleteBanner={handleDeleteBanner}
          />
        )}

        {view === 'CAR_DETAIL' && selectedCar && (
          <div className="animate-fade-in pb-20">
            <button 
              onClick={() => setView('HOME')}
              className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors font-bold text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para a Vitrine
            </button>

            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Galeria do {selectedCar.category}</h2>
                 <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span className="text-[10px] font-black uppercase">Vendedor Verificado</span>
                 </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200 snap-x">
                {selectedCar.images.map((img, idx) => (
                  <div key={idx} className="flex-shrink-0 w-full md:w-[700px] aspect-[16/10] rounded-[32px] overflow-hidden shadow-xl border border-gray-100 snap-center bg-gray-200">
                    <img src={img} className="w-full h-full object-cover" alt={`${selectedCar.model} - foto ${idx + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
              <div className="p-8 md:p-16 flex flex-col md:flex-row gap-12">
                <div className="flex-grow space-y-8">
                  <div>
                    <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase mb-2 inline-block">
                      {selectedCar.category}
                    </span>
                    <h1 className="text-5xl font-black text-gray-900 mb-2 uppercase tracking-tight leading-none tracking-tighter">{selectedCar.model}</h1>
                    <p className="text-4xl font-black text-green-600">
                      {formatCurrency(selectedCar.price)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Ano</span>
                      <span className="text-2xl font-black text-gray-900 block">{selectedCar.year || '-'}</span>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Detalhes</span>
                      <span className="text-2xl font-black text-gray-900 block">{selectedCar.engine || '-'}</span>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Cor</span>
                      <span className="text-2xl font-black text-gray-900 block">{selectedCar.color || '-'}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Descrição e Opcionais</h3>
                    <p className="text-gray-700 leading-relaxed text-xl whitespace-pre-wrap">
                      {selectedCar.description || 'Veículo em excelente estado de conservação.'}
                    </p>
                  </div>
                </div>

                <div className="md:w-[400px] flex-shrink-0 space-y-6">
                  <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl flex flex-col items-center text-center sticky top-28">
                    <span className="text-blue-100 font-bold text-sm uppercase mb-2 tracking-[0.2em]">Falar com Vendedor</span>
                    <a href={`tel:${selectedCar.phone}`} className="text-3xl font-black mb-10 hover:text-blue-100 transition-colors">
                      {selectedCar.phone}
                    </a>
                    <a 
                      href={`https://wa.me/55${selectedCar.phone.replace(/\D/g,'')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white text-blue-600 font-black py-5 rounded-2xl shadow-lg hover:scale-105 transition-all text-xl mb-6"
                    >
                      WhatsApp
                    </a>
                    
                    <div className="bg-blue-700/50 p-6 rounded-3xl border border-blue-500/30 text-left">
                       <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                          <span className="font-black text-[10px] uppercase tracking-widest text-yellow-400">Aviso de Segurança</span>
                       </div>
                       <p className="text-[11px] leading-relaxed text-blue-100">Evite pagamentos antecipados. Realize a transferência apenas após vistoria presencial e assinatura do recibo (CRV).</p>
                    </div>

                    <p className="mt-6 text-blue-200 text-[10px] italic font-bold uppercase tracking-widest">Publicado por Felipe Silva</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
