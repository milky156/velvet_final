import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const shopIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const SHOP_LOCATION = { lat: 8.907074, lng: 125.546973 };

function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !from || !to) return;
    if (!L.Routing || !L.Routing.control) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      lineOptions: {
        styles: [{ color: '#be185d', weight: 4 }]
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null
    }).addTo(map);

    return () => {
        if (map && routingControl) {
            map.removeControl(routingControl);
        }
    };
  }, [map, from, to]);

  return null;
}

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1] && !isNaN(center[0]) && !isNaN(center[1])) {
        map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapPreview({ lat, lng, address, height = "400px", showRoute = true }) {
  // Ensure we are in a browser environment
  if (typeof window === 'undefined') return <div style={{ height }} className="bg-brand-50" />;

  // Normalize inputs to numbers to avoid string concatenation bugs
  const nLat = Number(lat);
  const nLng = Number(lng);
  const hasValidCoords = !isNaN(nLat) && !isNaN(nLng) && lat !== null && lng !== null;

  const customerPosition = useMemo(() => [
    hasValidCoords ? nLat : 8.9475, 
    hasValidCoords ? nLng : 125.5406
  ], [nLat, nLng, hasValidCoords]);

  const shopPosition = [SHOP_LOCATION.lat, SHOP_LOCATION.lng];
  
  const centerPosition = useMemo(() => [
    (SHOP_LOCATION.lat + customerPosition[0]) / 2,
    (SHOP_LOCATION.lng + customerPosition[1]) / 2
  ], [customerPosition]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-inner border border-brand-100 bg-brand-50" style={{ height }}>
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={shopPosition} icon={shopIcon}>
          <Popup>
            <div className="text-center font-bold text-brand-900">
              <p>🌸 Velvet & Vine</p>
              <p className="text-[10px] font-medium text-brand-400">San Vicente, Butuan City</p>
            </div>
          </Popup>
        </Marker>

        {hasValidCoords && (
          <Marker position={customerPosition} icon={DefaultIcon}>
            <Popup>
              <div className="text-center font-bold text-brand-900">
                <p>📍 Delivery Point</p>
                {address && <p className="text-[10px] font-medium text-brand-400">{address}</p>}
              </div>
            </Popup>
          </Marker>
        )}

        {showRoute && hasValidCoords && (
          <Routing 
            from={SHOP_LOCATION} 
            to={{ lat: nLat, lng: nLng }} 
          />
        )}

        <ChangeView center={centerPosition} zoom={13} />
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] glass p-3 rounded-2xl border border-white/20 shadow-lg pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-600"></div>
            <p className="text-[10px] font-black text-brand-900 uppercase">Velvet & Vine Shop</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <p className="text-[10px] font-black text-brand-900 uppercase">Customer Location</p>
          </div>
        </div>
      </div>
    </div>
  );
}
