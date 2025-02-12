import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import type { GeoJSON as GeoJSONType } from 'geojson';
import './NorwayMap.css';

interface NorwayMapProps {
  geoData: GeoJSONType | null;
  darkMode: boolean;
}

interface HighlightedMunicipality {
  name: string;
  color: string;
}

interface MunicipalityWithCoords {
  name: string;
  latitude: number;
}

export function NorwayMap({ geoData, darkMode }: NorwayMapProps) {
  const [highlightedMunicipalities, setHighlightedMunicipalities] = useState<HighlightedMunicipality[]>([]);
  const intervalRef = useRef<number>();
  const municipalitiesRef = useRef<MunicipalityWithCoords[]>([]);

  // Define highlight colors - vibrant in light mode, pastel in dark mode
  const highlightColors = darkMode
    ? [
        '#fde047', // yellow
        '#93c5fd', // blue
        '#f9a8d4', // pink
        '#86efac', // green
        '#c4b5fd', // purple
        '#fdba74', // orange
        '#67e8f9', // cyan
        '#d8b4fe', // violet
        '#fca5a5', // red
        '#a5b4fc', // indigo
        '#bef264', // lime
        '#fb923c', // orange
        '#e879f9', // fuchsia
        '#5eead4', // teal
        '#f472b6', // pink
        '#a78bfa', // violet
        '#4ade80', // green
        '#2dd4bf', // teal
        '#f87171', // red
        '#60a5fa'  // blue
      ]
    : [
        '#ca8a04', // yellow
        '#2563eb', // blue
        '#db2777', // pink
        '#16a34a', // green
        '#7c3aed', // purple
        '#ea580c', // orange
        '#0891b2', // cyan
        '#7c3aed', // violet
        '#dc2626', // red
        '#4f46e5', // indigo
        '#65a30d', // lime
        '#c2410c', // orange
        '#a21caf', // fuchsia
        '#0d9488', // teal
        '#be185d', // pink
        '#6d28d9', // violet
        '#15803d', // green
        '#0f766e', // teal
        '#b91c1c', // red
        '#1d4ed8'  // blue
      ];

  useEffect(() => {
    if (geoData) {
      // Calculate centroid latitude for each municipality
      municipalitiesRef.current = geoData.features.map(feature => {
        const coordinates = feature.geometry.coordinates[0][0];
        const latitudes = coordinates.map((coord: number[]) => coord[1]);
        const averageLatitude = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        
        return {
          name: feature.properties.kommunenavn,
          latitude: averageLatitude
        };
      }).sort((a, b) => a.latitude - b.latitude); // Sort by latitude (south to north)

      let currentIndex = 0;
      
      const updateHighlightedMunicipalities = () => {
        const selectedMunicipalities = municipalitiesRef.current
          .slice(currentIndex, currentIndex + 40)
          .map((mun, index) => ({
            name: mun.name,
            color: highlightColors[index % highlightColors.length]
          }));

        setHighlightedMunicipalities(selectedMunicipalities);
        
        currentIndex = (currentIndex + 40) >= municipalitiesRef.current.length 
          ? 0 
          : currentIndex + 40;
      };

      updateHighlightedMunicipalities();
      
      intervalRef.current = window.setInterval(updateHighlightedMunicipalities, 3000);

      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      };
    }
  }, [geoData, darkMode]);

  const mapStyle = (feature: any) => {
    const highlightedMunicipality = highlightedMunicipalities.find(
      m => m.name === feature.properties.kommunenavn
    );

    return {
      fillColor: highlightedMunicipality
        ? highlightedMunicipality.color
        : (darkMode ? '#374151' : '#ccc'),
      weight: highlightedMunicipality ? 2 : 1,
      opacity: 1,
      color: '#000000',
      fillOpacity: highlightedMunicipality ? 0.9 : 0.7,
      className: 'municipality-path'
    };
  };

  if (!geoData) return null;

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[65.0, 17]}
        zoom={4.5}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
        zoomControl={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
      >
        <GeoJSON
          data={geoData}
          style={mapStyle}
        />
      </MapContainer>
    </div>
  );
}