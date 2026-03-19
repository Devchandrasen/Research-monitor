'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { CountryData, MapViewMode } from '@/types';
import { cn } from '@/lib/utils';

interface WorldMapProps {
  countries: CountryData[];
  selectedCountry: CountryData | null;
  onSelectCountry: (country: CountryData | null) => void;
  viewMode: MapViewMode;
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const getColorForValue = (value: number, max: number, mode: MapViewMode): string => {
  const ratio = Math.min(value / max, 1);
  
  const colorScales: Record<MapViewMode, [string, string]> = {
    research: ['#1e3a5f', '#06b6d4'],
    phd: ['#3b0764', '#a855f7'],
    postdoc: ['#7c2d12', '#f97316'],
    funding: ['#064e3b', '#10b981'],
  };
  
  const [startColor, endColor] = colorScales[mode];
  
  // Simple gradient interpolation
  const startR = parseInt(startColor.slice(1, 3), 16);
  const startG = parseInt(startColor.slice(3, 5), 16);
  const startB = parseInt(startColor.slice(5, 7), 16);
  const endR = parseInt(endColor.slice(1, 3), 16);
  const endG = parseInt(endColor.slice(3, 5), 16);
  const endB = parseInt(endColor.slice(5, 7), 16);
  
  const r = Math.round(startR + (endR - startR) * ratio);
  const g = Math.round(startG + (endG - startG) * ratio);
  const b = Math.round(startB + (endB - startB) * ratio);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const getValueForMode = (country: CountryData, mode: MapViewMode): number => {
  switch (mode) {
    case 'research':
      return country.researchOutput;
    case 'phd':
      return country.phdPositions;
    case 'postdoc':
      return country.postdocPositions;
    case 'funding':
      return country.fundingAvailable;
    default:
      return country.researchOutput;
  }
};

const formatValue = (value: number, mode: MapViewMode): string => {
  if (mode === 'funding') {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  }
  return value.toLocaleString();
};

export default function WorldMap({ countries, selectedCountry, onSelectCountry, viewMode }: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const maxValue = useMemo(() => {
    return Math.max(...countries.map(c => getValueForMode(c, viewMode)));
  }, [countries, viewMode]);

  const countryCoords = useMemo(() => {
    const coords: Record<string, { lat: number; lon: number }> = {};
    countries.forEach(c => {
      if (c.latitude && c.longitude) {
        coords[c.code] = { lat: c.latitude, lon: c.longitude };
      }
    });
    return coords;
  }, [countries]);

  return (
    <div className="relative w-full h-full bg-slate-900/50 rounded-xl overflow-hidden">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: 140,
          center: [0, 0],
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.properties.ISO_A2;
              const country = countries.find(c => c.code === countryCode);
              const value = country ? getValueForMode(country, viewMode) : 0;
              const isHovered = hoveredCountry === countryCode;
              const isSelected = selectedCountry?.code === countryCode;
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={country ? getColorForValue(value, maxValue, viewMode) : '#1e293b'}
                  stroke="#0f172a"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: 'none',
                      opacity: country ? 1 : 0.3,
                    },
                    hover: {
                      outline: 'none',
                      opacity: 1,
                      stroke: '#fff',
                      strokeWidth: 1,
                    },
                    pressed: {
                      outline: 'none',
                    },
                  }}
                  onMouseEnter={() => {
                    setHoveredCountry(countryCode);
                  }}
                  onMouseLeave={() => {
                    setHoveredCountry(null);
                  }}
                  onClick={() => {
                    if (country) {
                      onSelectCountry(isSelected ? null : country);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {/* Markers for countries with data */}
        {countries.map(country => {
          if (!country.latitude || !country.longitude) return null;
          const value = getValueForMode(country, viewMode);
          const isSelected = selectedCountry?.code === country.code;
          
          return (
            <Marker
              key={country.code}
              coordinates={[country.longitude, country.latitude]}
            >
              <motion.circle
                r={isSelected ? 8 : 4}
                fill={getColorForValue(value, maxValue, viewMode)}
                stroke={isSelected ? '#fff' : 'transparent'}
                strokeWidth={isSelected ? 2 : 0}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.5 }}
                className="cursor-pointer"
              />
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Hover tooltip */}
      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg px-4 py-3 border border-slate-700 shadow-xl">
          {(() => {
            const country = countries.find(c => c.code === hoveredCountry);
            if (!country) return null;
            const value = getValueForMode(country, viewMode);
            
            return (
              <div>
                <h4 className="font-semibold text-white text-sm">{country.name}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  <span className="text-slate-400">
                    {viewMode === 'research' && 'Research Output: '}
                    {viewMode === 'phd' && 'PhD Positions: '}
                    {viewMode === 'postdoc' && 'Postdoc Positions: '}
                    {viewMode === 'funding' && 'Available Funding: '}
                  </span>
                  <span className="font-medium text-white ml-1">{formatValue(value, viewMode)}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  R&D Investment: {country.rInvestment}% of GDP
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/95 backdrop-blur-sm rounded-lg px-4 py-3 border border-slate-700">
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Intensity</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColorForValue(0, maxValue, viewMode) }} />
            <div className="w-6 h-3 rounded-sm" style={{ backgroundColor: getColorForValue(maxValue * 0.33, maxValue, viewMode) }} />
            <div className="w-6 h-3 rounded-sm" style={{ backgroundColor: getColorForValue(maxValue * 0.66, maxValue, viewMode) }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColorForValue(maxValue, maxValue, viewMode) }} />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Low</span>
            <span>→</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
