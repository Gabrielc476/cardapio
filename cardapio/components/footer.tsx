'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./map').then(mod => mod.Map), { 
  ssr: false,
  loading: () => (
    <div className="h-[350px] w-full rounded-lg border border-gray-700 mb-5 bg-gray-900 flex items-center justify-center">
      <p>Carregando mapa...</p>
    </div>
  )
});

export function Footer() {
  return (
    <footer className="bg-black text-muted-foreground py-10 px-5 mt-10 border-t border-gray-700 text-center">
      <div className="container mx-auto">
        <div className="h-[350px] w-full rounded-lg border border-gray-700 mb-5">
            <Map />
        </div>
        <div className="address-container">
          <h3 className="text-2xl font-['Montserrat'] text-orange-400 mb-2">
            Nosso Endereço
          </h3>
          <p>UNIESP - Bloco Central, Rod. BR 230, Km 14, s/n - Morada Nova, Cabedelo - PB</p>
        </div>
      </div>
    </footer>
  );
}
