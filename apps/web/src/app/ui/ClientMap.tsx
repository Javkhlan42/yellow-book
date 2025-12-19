'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Газрын зураг уншиж байна...</div>
    </div>
  ),
  ssr: false,
});

interface ClientMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  businessName?: string;
}

export default function ClientMap(props: ClientMapProps) {
  return <Map {...props} />;
}
