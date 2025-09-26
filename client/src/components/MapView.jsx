import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icons
const createCustomIcon = (color = '#f97316') => {
  return L.divIcon({
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, ${color}, #ec4899);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Component to update map view when location changes
const MapUpdater = ({ center, zoom, selectedLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedLocation && selectedLocation.coordinates) {
      map.flyTo(selectedLocation.coordinates, zoom || 12, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    } else if (center) {
      map.setView(center, zoom || 5);
    }
  }, [map, center, zoom, selectedLocation]);
  
  return null;
};

const MapView = ({ 
  center = [-25.2744, 133.7751], 
  zoom = 5, 
  markers = [], 
  selectedLocation = null,
  onLocationClick = null 
}) => {
  const mapRef = useRef();

  // Create markers array including selected location
  const allMarkers = [...markers];
  if (selectedLocation && selectedLocation.coordinates) {
    allMarkers.push({
      position: selectedLocation.coordinates,
      popup: selectedLocation.name || 'Selected Location',
      isSelected: true
    });
  }

  const handleMapClick = (e) => {
    if (onLocationClick) {
      const { lat, lng } = e.latlng;
      onLocationClick({
        coordinates: [lat, lng],
        name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Map Overlay for artistic effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-rose-500/5 pointer-events-none z-10 rounded-t-3xl"></div>
      
      <MapContainer 
        center={selectedLocation?.coordinates || center} 
        zoom={selectedLocation ? 12 : zoom} 
        className="h-full w-full rounded-t-3xl"
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        whenCreated={(map) => {
          if (onLocationClick) {
            map.on('click', handleMapClick);
          }
          
          // Enable scroll zoom only when Ctrl/Cmd is pressed
          map.on('focus', () => {
            map.scrollWheelZoom.enable();
          });
          map.on('blur', () => {
            map.scrollWheelZoom.disable();
          });
          
          // Add custom zoom control
          L.control.zoom({
            position: 'bottomright'
          }).addTo(map);
          
          // Add attribution
          L.control.attribution({
            position: 'bottomleft',
            prefix: false
          }).addTo(map);
        }}
      >
        {/* Use a more artistic map style */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
        />
        
        <MapUpdater 
          center={center} 
          zoom={zoom} 
          selectedLocation={selectedLocation} 
        />
        
        {allMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position}
            icon={createCustomIcon(marker.isSelected ? '#f97316' : '#6366f1')}
          >
            <Popup
              className="custom-popup"
              closeButton={false}
              offset={[0, -10]}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 border-0 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${marker.isSelected ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">
                      {marker.popup}
                    </div>
                    {marker.isSelected && (
                      <div className="text-xs text-orange-600 mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Selected Location
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/20">
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Scroll hint overlay */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/20">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Double-click to zoom</span>
          </div>
        </div>
      </div>
      
      {/* Location indicator */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-800">
                {selectedLocation.name}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
