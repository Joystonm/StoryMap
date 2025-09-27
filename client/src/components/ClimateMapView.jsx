import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom climate event icons
const createClimateIcon = (type, count) => {
  const icons = {
    bushfires: { emoji: '🔥', color: '#dc2626' },
    floods: { emoji: '🌊', color: '#2563eb' },
    droughts: { emoji: '🌵', color: '#ca8a04' }
  };
  
  const config = icons[type] || icons.bushfires;
  
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        background: ${config.color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">${config.emoji}</div>
      ${count > 1 ? `
        <div style="
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${count}</div>
      ` : ''}
    `,
    className: 'climate-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// Component to update map view
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 6);
    }
  }, [map, center, zoom]);
  
  return null;
};

const ClimateMapView = ({ 
  center = [-25.2744, 133.7751], 
  zoom = 6, 
  climateEvents = [],
  onEventClick = null 
}) => {
  const mapRef = useRef();

  // Show ALL events - no filtering
  const allEvents = climateEvents;

  console.log('Showing all events:', allEvents.length);
  console.log('Event coordinates check:', allEvents.map(e => ({
    id: e.id,
    type: e.type,
    coordinates: e.coordinates,
    valid: e.coordinates && Array.isArray(e.coordinates) && e.coordinates.length === 2
  })));

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        className="h-full w-full rounded-xl"
        ref={mapRef}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        whenCreated={(map) => {
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
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
        />
        
        <MapUpdater center={center} zoom={zoom} />
        
        {/* Climate Event Markers - ALL EVENTS */}
        {allEvents.filter(event => 
          event.coordinates && 
          Array.isArray(event.coordinates) && 
          event.coordinates.length === 2 &&
          typeof event.coordinates[0] === 'number' && 
          typeof event.coordinates[1] === 'number'
        ).map((event) => (
          <Marker 
            key={event.id} 
            position={[event.coordinates[0], event.coordinates[1]]}
            icon={createClimateIcon(
              event.type === 'Bushfire' ? 'bushfires' : 
              event.type === 'Flood' ? 'floods' : 
              event.type === 'Drought' ? 'droughts' : 'droughts',
              1
            )}
            eventHandlers={{
              click: () => {
                if (onEventClick) {
                  onEventClick(event);
                }
              }
            }}
          >
            <Popup
              className="climate-popup"
              closeButton={true}
              offset={[0, -16]}
            >
              <div className="bg-white rounded-lg p-4 min-w-[250px]">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">
                    {event.type === 'Bushfire' ? '🔥' : 
                     event.type === 'Flood' ? '🌊' : '🌵'}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{event.type}</h3>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Year:</span>
                    <span className="text-sm text-gray-900">{event.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Severity:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      event.severity === 'Extreme' ? 'bg-red-100 text-red-800' :
                      event.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      event.severity === 'Major' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Frequency:</span>
                    <span className="text-sm text-gray-900">
                      {allEvents.filter(e => 
                        e.location === event.location && 
                        e.type === event.type
                      ).length} times
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-2">
                  <p className="text-xs text-gray-600 mb-2">Impact:</p>
                  <p className="text-sm text-gray-800">{event.impact}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Event Legend - No Filters */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Climate Events</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-medium text-gray-700">Bushfires</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {allEvents.filter(e => e.type === 'Bushfire').length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌊</span>
              <span className="text-sm font-medium text-gray-700">Floods</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {allEvents.filter(e => e.type === 'Flood').length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🌵</span>
              <span className="text-sm font-medium text-gray-700">Droughts</span>
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                {allEvents.filter(e => e.type === 'Drought').length}
              </span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-800">
              {allEvents.length} total events displayed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateMapView;
