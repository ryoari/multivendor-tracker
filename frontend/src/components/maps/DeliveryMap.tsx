"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

// Map controller component to handle map reference and updates
function MapController({ position }: { position: { lat: number; lng: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom() || 15);
    }
  }, [map, position]);
  
  return null;
}

interface DeliveryMapProps {
  position: { lat: number; lng: number } | null;
  defaultCenter?: [number, number];
}

export default function DeliveryMap({ 
  position, 
  defaultCenter = [20.5937, 78.9629] // Default to center of India
}: DeliveryMapProps) {
  return (
    <MapContainer
      center={position ? [position.lat, position.lng] : defaultCenter}
      zoom={position ? 15 : 6}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      scrollWheelZoom={true}
    >
      <MapController position={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker position={[position.lat, position.lng]}>
          <Popup>Delivery Partner is here!</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}