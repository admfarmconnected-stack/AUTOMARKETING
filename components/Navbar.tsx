
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-4 max-w-7xl h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('HOME')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:rotate-6 transition-transform">
            AM
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">
            AUTO<span className="text-blue-600">MARKETING</span>
          </span>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setView('HOME')}
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              currentView === 'HOME' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Vitrine
          </button>
          <button 
            onClick={() => setView('ADMIN')}
            className={`px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
              currentView === 'ADMIN' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09c.059-.101.12-.202.178-.305m2.42-8.123c.33-.578.541-1.21.623-1.884l.006-.054c.003-.027.005-.054.008-.081M11 3l.053.003c.307.024.614.034.92.034.99 0 1.947-.11 2.855-.316a12.003 12.003 0 00-6.6-6.6A11.956 11.956 0 0011 3z" />
            </svg>
            Administrar
          </button>
        </div>
      </div>
    </nav>
  );
};
