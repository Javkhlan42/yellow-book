'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import type { Organization } from '../../../types/organization';

interface MapIslandProps {
  organizations: Organization[];
}

// Client-side only map component
const MapIslandComponent = dynamic<MapIslandProps>(
  () => import('./MapIsland'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-blue-200">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-pulse" />
          <p className="text-blue-600 font-medium">Газрын зураг уншиж байна...</p>
          <p className="text-blue-400 text-sm mt-1">Бүх байршлыг харуулж байна</p>
        </div>
      </div>
    ),
  }
);

export function MapIsland({ organizations }: MapIslandProps) {
  return <MapIslandComponent organizations={organizations} />;
}

export type { MapIslandProps };
