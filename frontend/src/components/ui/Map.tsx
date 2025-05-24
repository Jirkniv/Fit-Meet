import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useState } from 'react';

type ClickableMarkerProps = {
  markerPos: [number, number] | null;
  setMarkerPos: (pos: [number, number]) => void;
  locked: boolean;
};

const ClickableMarker = ({ markerPos, setMarkerPos, locked }: ClickableMarkerProps) => {
  useMapEvent('click', (e) => {
    if (!locked) {
      setMarkerPos([e.latlng.lat, e.latlng.lng]);
    }
  });
  return markerPos ? (
    <Marker position={markerPos}>
      <Popup>
        Latitude: {markerPos[0]}, Longitude: {markerPos[1]}
      </Popup>
    </Marker>
  ) : null;
};

type MapProps = {
  locked: boolean;
  onMarkerChange?: (latitude: number, longitude: number) => void;
  initialPosition?: [number, number]; // Nova prop para posição inicial
};

const Map = ({ locked, onMarkerChange, initialPosition }: MapProps) => {
  const defaultPosition: [number, number] = [-19.82853362565354, -43.087692260742195];
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(initialPosition || defaultPosition);

  const handleMapClick = (e: any) => {
    if (!locked) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkerPos(newPosition);
      if (onMarkerChange) {
        onMarkerChange(newPosition[0], newPosition[1]); // Notifica o componente pai
      }
    }
  };

  return (
    <div>
      <MapContainer
        className="z-[1] w-[120px] h-[208px] md:w-[280px] md:h-[220px] sm:w-[250px] sm:h-[258px]"
        center={markerPos || defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        whenReady={(map) => {
          map.target.on('click', handleMapClick); // Adiciona o evento de clique
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPos && (
          <Marker position={markerPos}>
            <Popup>
              Latitude: {markerPos[0]}, Longitude: {markerPos[1]}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
