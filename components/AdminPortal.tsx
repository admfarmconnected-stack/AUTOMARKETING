
import React, { useState } from 'react';
import { Car, Banner } from '../types';

interface AdminPortalProps {
  cars: Car[];
  banners: Banner[];
  onAddCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onAddBanner: (banner: Banner) => void;
  onDeleteBanner: (id: string) => void;
}

// Utilitário para comprimir imagens antes do upload
const compressImage = (base64: string, maxWidth = 1000, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
  });
};

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  cars, 
  banners, 
  onAddCar, 
  onDeleteCar, 
  onAddBanner,
  onDeleteBanner 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'CARS' | 'BANNERS'>('CARS');
  const [isUploading, setIsUploading] = useState(false);

  const [newCar, setNewCar] = useState<Partial<Car>>({
    category: 'Carro',
    model: '',
    price: 0,
    year: '',
    engine: '',
    color: '',
    location: '',
    phone: '',
    description: '',
    images: []
  });

  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    partnerName: '',
    link: '',
    imageUrl: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais solicitadas pelo usuário
    const validLogin = "FELIPE SILVA";
    const validPass = "123456789";
    
    if (loginInput.trim().toUpperCase() === validLogin.toUpperCase() && passwordInput.trim() === validPass) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Acesso negado. Verifique login e senha.');
    }
  };

  const handleCarImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setIsUploading(true);
    const fileList = Array.from(files).slice(0, 5);
    const readers = fileList.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string);
          resolve(compressed);
        };
        reader.readAsDataURL(file);
      });
    });

    const compressedImages = await Promise.all(readers);
    setNewCar(prev => ({ ...prev, images: compressedImages }));
    setIsUploading(false);
  };

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string, 1200, 0.6);
      setNewBanner(prev => ({ ...prev, imageUrl: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.model || !newCar.price || !newCar.phone || !newCar.images?.length) {
      return alert('Dados incompletos! Modelo, Preço, Whats e Fotos são obrigatórios.');
    }

    const carToSave: Car = {
      id: Date.now().toString(),
      category: newCar.category || 'Carro',
      model: newCar.model!,
      price: Number(newCar.price),
      year: newCar.year || '',
      engine: newCar.engine || '',
      color: newCar.color || '',
      location: newCar.location || 'Felipe Silva',
      phone: newCar.phone!,
      description: newCar.description || '',
      images: newCar.images || [],
      createdAt: Date.now()
    };
    onAddCar(carToSave);
    setNewCar({ category: 'Carro', model: '', price: 0, year: '', engine: '', color: '', location: '', phone: '', description: '', images: [] });
    alert('Veículo adicionado com sucesso ao estoque!');
  };

  const handleSubmitBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.partnerName || !newBanner.imageUrl) return alert('Dê um nome e escolha uma foto para o banner.');
    const bannerToSave: Banner = {
      id: Date.now().toString(),
      partnerName: newBanner.partnerName!,
      link: newBanner.link || '#',
      imageUrl: newBanner.imageUrl!
    };
    onAddBanner(bannerToSave);
    setNewBanner({ partnerName: '', link: '', imageUrl: '' });
    alert('Novo banner ativado!');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-2 leading-none">Painel <span className="text-blue-600">Admin</span></h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Acesso Restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="text" 
              value={loginInput} 
              onChange={e => setLoginInput(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-bold uppercase"
              placeholder="USUÁRIO"
            />
            <input 
              type="password" 
              value={passwordInput} 
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all font-bold"
              placeholder="SENHA"
            />
            {error && <p className="text-red-500 text-sm font-black text-center animate-bounce">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl shadow-xl hover:bg-blue-700 transition-all transform active:scale-95 shadow-blue-200 uppercase tracking-widest">Entrar Agora</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
        <div>
           <h2 className="text-4xl font-black text-gray-900 leading-none">GERENCIAMENTO <span className="text-blue-600">ESTOQUE</span></h2>
           <p className="text-gray-400 font-bold uppercase text-xs mt-2">Capacidade: Ilimitada (IndexedDB Ativo)</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-100 p-2 rounded-2xl flex">
            <button onClick={() => setActiveTab('CARS')} className={`px-8 py-4 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'CARS' ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-500 hover:text-gray-900'}`}>Veículos</button>
            <button onClick={() => setActiveTab('BANNERS')} className={`px-8 py-4 rounded-xl font-black uppercase text-xs transition-all ${activeTab === 'BANNERS' ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-500 hover:text-gray-900'}`}>Publicidade</button>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="bg-red-50 text-red-600 font-black px-8 py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs uppercase border border-red-100">Sair</button>
        </div>
      </div>

      {activeTab === 'CARS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          <section className="lg:col-span-5 bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100 h-fit">
            <h3 className="text-2xl font-black mb-8 border-b pb-4">Nova Postagem</h3>
            <form onSubmit={handleSubmitCar} className="space-y-6">
              <div className="flex gap-4 p-1 bg-gray-100 rounded-2xl mb-4">
                 <button type="button" onClick={() => setNewCar(p => ({...p, category: 'Carro'}))} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${newCar.category === 'Carro' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500'}`}>Carro</button>
                 <button type="button" onClick={() => setNewCar(p => ({...p, category: 'Moto'}))} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${newCar.category === 'Moto' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500'}`}>Moto</button>
              </div>
              
              <input type="text" placeholder="Modelo do Veículo" required value={newCar.model} onChange={e => setNewCar(p => ({...p, model: e.target.value}))} className="w-full px-6 py-5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold" />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Preço" required value={newCar.price || ''} onChange={e => setNewCar(p => ({...p, price: Number(e.target.value)}))} className="w-full px-6 py-5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none font-bold" />
                <input type="text" placeholder="Ano" value={newCar.year} onChange={e => setNewCar(p => ({...p, year: e.target.value}))} className="w-full px-6 py-5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Motor / Detalhes" value={newCar.engine} onChange={e => setNewCar(p => ({...p, engine: e.target.value}))} className="w-full px-6 py-5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none font-bold" />
                <input type="text" placeholder="WhatsApp" required value={newCar.phone} onChange={e => setNewCar(p => ({...p, phone: e.target.value}))} className="w-full px-6 py-5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none font-bold" />
              </div>

              <textarea placeholder="Descrição curta..." value={newCar.description} onChange={e => setNewCar(p => ({...p, description: e.target.value}))} className="w-full px-6 py-5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none h-32 resize-none font-medium" />
              
              <div className="space-y-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Fotos (Máx 5)</label>
                   {isUploading && <span className="text-blue-600 text-[10px] font-black animate-pulse">Comprimindo Imagens...</span>}
                </div>
                <div className="relative h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group">
                  <input type="file" multiple accept="image/*" onChange={handleCarImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 mb-2 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <span className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Enviar do Celular ou PC</span>
                </div>
                {newCar.images && newCar.images.length > 0 && (
                  <div className="flex gap-3 p-4 bg-gray-50 rounded-3xl overflow-x-auto scrollbar-hide border border-gray-100">
                    {newCar.images.map((img, i) => (
                      <div key={i} className="relative flex-shrink-0 group">
                         <img src={img} className="w-20 h-20 object-cover rounded-2xl border-2 border-white shadow-md" />
                         <button type="button" onClick={() => setNewCar(p => ({...p, images: p.images?.filter((_, idx) => idx !== i)}))} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={isUploading} className={`w-full bg-blue-600 text-white font-black py-7 rounded-[32px] shadow-2xl hover:bg-blue-700 transition-all transform active:scale-95 shadow-blue-100 uppercase tracking-widest ${isUploading ? 'opacity-50' : ''}`}>
                Finalizar Postagem
              </button>
            </form>
          </section>

          <section className="lg:col-span-7 bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-black mb-8 flex items-center justify-between">
               Estoque Ativo
               <span className="text-xs bg-gray-100 px-4 py-1 rounded-full font-bold">{cars.length} itens</span>
            </h3>
            <div className="space-y-4 overflow-y-auto max-h-[800px] pr-4 custom-scrollbar">
              {cars.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-black uppercase tracking-widest">Nenhum veículo cadastrado</p>
                </div>
              ) : (
                cars.map(car => (
                  <div key={car.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-gray-50 rounded-[40px] border border-transparent hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all group">
                    <img src={car.images[0]} className="w-32 h-24 object-cover rounded-3xl shadow-sm" />
                    <div className="flex-grow text-center sm:text-left">
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-1">
                        <span className="text-[8px] bg-blue-100 text-blue-600 font-black px-2 py-0.5 rounded-full uppercase">{car.category}</span>
                        <span className="text-[8px] bg-gray-200 text-gray-600 font-black px-2 py-0.5 rounded-full uppercase">{car.year}</span>
                      </div>
                      <h4 className="font-black text-gray-900 uppercase text-lg leading-tight tracking-tighter">{car.model}</h4>
                      <p className="text-green-600 font-black text-lg">R$ {car.price.toLocaleString('pt-BR')}</p>
                    </div>
                    <button 
                      onClick={() => { if(confirm(`Excluir permanentemente o ${car.model}?`)) onDeleteCar(car.id); }} 
                      className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm flex-shrink-0"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
          <section className="lg:col-span-5 bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-black mb-8">Nova Parceria</h3>
            <form onSubmit={handleSubmitBanner} className="space-y-6">
              <input type="text" placeholder="Nome da Empresa / Serviço" required value={newBanner.partnerName} onChange={e => setNewBanner(p => ({...p, partnerName: e.target.value}))} className="w-full px-8 py-5 bg-gray-50 rounded-3xl ring-1 ring-gray-100 outline-none font-bold" />
              <input type="text" placeholder="Link de Redirecionamento" value={newBanner.link} onChange={e => setNewBanner(p => ({...p, link: e.target.value}))} className="w-full px-8 py-5 bg-gray-50 rounded-3xl ring-1 ring-gray-100 outline-none font-bold" />
              <div className="relative h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all">
                <input type="file" accept="image/*" onChange={handleBannerImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="font-black text-gray-400 text-xs uppercase tracking-[0.2em] text-center px-4">Carregar Imagem Publicitária</span>
              </div>
              {newBanner.imageUrl && (
                <div className="relative">
                  <img src={newBanner.imageUrl} className="w-full h-auto rounded-[32px] shadow-2xl border-4 border-white" />
                  <button type="button" onClick={() => setNewBanner(p => ({...p, imageUrl: ''}))} className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-2xl">×</button>
                </div>
              )}
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-7 rounded-[32px] shadow-2xl uppercase tracking-widest">Publicar Agora</button>
            </form>
          </section>

          <section className="lg:col-span-7 bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-black mb-8">Banners Ativos</h3>
            <div className="space-y-8 overflow-y-auto max-h-[800px] pr-4">
              {banners.length === 0 ? (
                <p className="text-gray-400 italic text-center py-20">Nenhuma parceria ativa.</p>
              ) : (
                banners.map(banner => (
                  <div key={banner.id} className="relative group">
                    <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-2xl">
                      <span className="font-black text-gray-900 uppercase text-xs tracking-widest">{banner.partnerName}</span>
                      <button 
                        onClick={() => { if(confirm('Remover esta publicidade?')) onDeleteBanner(banner.id); }} 
                        className="text-red-500 bg-white p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <img src={banner.imageUrl} className="w-full rounded-[40px] shadow-lg border border-gray-100" />
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
