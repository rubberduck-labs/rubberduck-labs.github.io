import React from 'react';
import { ImpactSection } from '../components/ImpactSection';
import type { GeoJSON as GeoJSONType } from 'geojson';

interface ImpactPageProps {
  geoData: GeoJSONType | null;
  darkMode: boolean;
}

export function ImpactPage({ geoData, darkMode }: ImpactPageProps) {
  return (
    <div>
      <ImpactSection geoData={geoData} darkMode={darkMode} />
    </div>
  );
}