import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material'; 
import { useApartmentService } from '../middleware/apartment/apartmentServiceHooks';
import { Apartments as Estatics } from '../data/data'; 
import '../styles/Map.css';

const createCustomIcon = (color = 'black', logoUrl = '', text = '') => {
  const getLogoPath = (url) => {
    if (!url || url.length < 2) return null;
    if (url.startsWith('http')) return url;
    const fileName = url.split('/').pop();
    return `/src/images/${fileName}`;
  };

  const finalLogo = getLogoPath(logoUrl);
  const content = finalLogo ? `<div style="background-image: url('${finalLogo}'); width: 24px; height: 24px; background-size: cover; background-repeat: no-repeat; background-position: center; border-radius: 50%; background-color: white;"></div>`: `<div style="font-size: 16px; color: white; font-weight: bold; line-height: 1;">${text}</div>`;
  
  const htmlContent = `
    <div style="display: flex; flex-direction: column; align-items: center; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));">
      <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2;">${content}</div>
      <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 9px solid ${color}; margin-top: -2px; z-index: 1;"></div>
    </div>`;
  return L.divIcon({className: 'custom-pin-clean', html: htmlContent, iconSize: [32, 39], iconAnchor: [16, 39], popupAnchor: [0, -40]});
};

function MapController({center, zoom}) {const map = useMap(); useEffect(() => {if (center?.[0] && center?.[1]) {map.setView(center, zoom, { animate: true, duration: 0.8 });}}, [center, zoom, map]); return null;}

function MapView({ pisFocus }) {
  const api = useApartmentService();
  const { data: apartamentsAPI } = useQuery({queryKey: ["apartaments"], queryFn: () => api.llistar(), enabled: !!api.llistar, refetchInterval: 1000});
  const { data: escolesGlobals } = useQuery({queryKey: ["escoles"], queryFn: () => api.llistarEscoles ? api.llistarEscoles() : Promise.resolve([]), enabled: !!api.llistarEscoles, refetchInterval: 1000});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState([41.3902, 2.1540]);
  const [mapZoom, setMapZoom] = useState(11);
  const propertyIcons = {'apartment': '🏢', 'duplex': '🏘️', 'house': '🏠', 'default': '📍'};
  const handlePropertyClick = useCallback((property) => {if (!property?.lat || !property?.lng) return; setSelectedProperty(property); setMapCenter([parseFloat(property.lat), parseFloat(property.lng)]); setMapZoom(16);}, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (pisFocus?.id && Number(selectedProperty?.id) !== Number(pisFocus.id)) {handlePropertyClick(pisFocus);}
  }, [pisFocus, handlePropertyClick, selectedProperty?.id]);

  const getEscolesRealsPerApartament = useCallback((aptId) => {
    const propId = Number(aptId);
    const estatiques = Estatics.find(a => Number(a.id) === propId)?.schools || [];
    const aptReal = apartamentsAPI?.find(a => Number(a.id) === propId);
    const bdDirectes = aptReal?.schools || [];
    const bdInverses = escolesGlobals?.filter(e => e.apartments?.some(ap => Number(ap.id) === propId)) || [];
    const unificador = new Map();
    [...estatiques, ...bdDirectes, ...bdInverses].forEach(s => {
      const nomNormalitzat = s.name.toLowerCase().trim(); 
      const existent = unificador.get(nomNormalitzat); 
      unificador.set(nomNormalitzat, {...existent,...s, isVerified: existent?.isVerified || !!s.id, seus: s.seus?.length > 0 ? s.seus : (existent?.seus || [])});
    });
    return Array.from(unificador.values());
  }, [apartamentsAPI, escolesGlobals]);

  const markers = useMemo(() => {
    if (!selectedProperty) return [];
    const escoles = getEscolesRealsPerApartament(selectedProperty.id);
    return escoles.flatMap((school, idx) => {
      const color = school.isVerified ? '#2281D2' : '#10b981'; 
      const logo = school.logoUrl || school.logo || '';
      if (school.seus?.length > 0) {
        return school.seus.map((seu, sIdx) => ({
          id: `seu-${school.id || idx}-${sIdx}`,
          lat: parseFloat(seu.lat), lng: parseFloat(seu.lng),
          name: `${school.name} - ${seu.nom || 'Seu'}`,
          address: seu.adreça || school.address || '',
          color, logo
        })).filter(m => !isNaN(m.lat) && !isNaN(m.lng));
      }
      const lat = parseFloat(school.lat); 
      const lng = parseFloat(school.lng); 
      if (isNaN(lat) || isNaN(lng)) return [];
      return [{id: school.id ? `db-${school.id}` : `st-${idx}`, lat, lng, name: school.name, address: school.address || '', color, logo, text: logo ? '' : '🏫'}];
    });
  }, [selectedProperty, getEscolesRealsPerApartament]);

  return (
    <div className="app-container1">
      <div className="left-column">
        <h2>Propietats</h2>
        <div className="property-list">
          {apartamentsAPI?.map((prop) => {
            const escolesCount = getEscolesRealsPerApartament(prop.id).length;
            const isSelected = Number(selectedProperty?.id) === Number(prop.id);
            return (
              <div key={prop.id} className={`property-item ${isSelected ? 'selected' : ''}`} onClick={() => handlePropertyClick(prop)}>
                <h3 style={{ margin: 0 }}>{prop.propertyType} - ID {prop.id}</h3>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: 'text.secondary', fontWeight: 'bold' }}>
                  🎓 {escolesCount} School{escolesCount !== 1 ? 's' : ''}
                </Typography>
              </div>);
          })}
        </div>
      </div>

      <div className="right-column">
        <MapContainer center={mapCenter} zoom={mapZoom} className="map-container">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController center={mapCenter} zoom={mapZoom} />
          {selectedProperty && (
            <>
              <Circle center={[parseFloat(selectedProperty.lat), parseFloat(selectedProperty.lng)]} radius={500} pathOptions={{ fillColor: '#8122D2', fillOpacity: 0.1, color: '#8122D2', weight: 2 }} />
              <Marker position={[parseFloat(selectedProperty.lat), parseFloat(selectedProperty.lng)]} 
                icon={createCustomIcon('#8122D2','', propertyIcons[(selectedProperty.propertyType || selectedProperty.type || '').toLowerCase()] || propertyIcons.default)}>
                <Popup><h4>{(selectedProperty.propertyType || selectedProperty.type || 'Propietat').toUpperCase()} ID {selectedProperty.id}</h4></Popup>
              </Marker>
            </>
          )}

          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={createCustomIcon(m.color, m.logo, m.text)}>
              <Popup><strong>{m.name}</strong><br/><small>{m.address}</small></Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;