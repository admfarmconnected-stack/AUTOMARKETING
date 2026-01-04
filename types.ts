
export interface Car {
  id: string;
  category: 'Carro' | 'Moto';
  model: string;
  price: number;
  year: string;
  engine: string;
  color: string;
  location: string;
  phone: string;
  description: string;
  images: string[]; // Base64 strings otimizadas
  createdAt: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  link: string;
  partnerName: string;
}

export type ViewState = 'HOME' | 'ADMIN' | 'CAR_DETAIL';
