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
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        ${config.emoji}
        ${count > 1 ? `
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            background: white;
            color: ${config.color};
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
      </div>
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
  activeFilters = ['bushfires', 'floods', 'droughts'],
  onEventClick = null 
}) => {
  const mapRef = useRef();

  // Filter events based on active filters
  const filteredEvents = climateEvents.filter(event => 
    activeFilters.includes(event.type)
  );

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
        
        {/* Climate Event Markers */}
        {filteredEvents.map((event) => (
          <Marker 
            key={event.id} 
            position={[event.lat, event.lon]}
            icon={createClimateIcon(event.type, event.count)}
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
              <div className="bg-white rounded-lg p-4 min-w-[200px]">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">
                    {event.type === 'bushfires' ? '🔥' : 
                     event.type === 'floods' ? '🌊' : '🌵'}
                  </span>
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {event.type.slice(0, -1)} Events
                  </h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Events:</span>
                    <span className="font-medium">{event.count}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Severity:</span>
                    <span className={`font-medium capitalize ${
                      event.severity === 'high' ? 'text-red-600' :
                      event.severity === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {event.severity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Event:</span>
                    <span className="font-medium">{event.lastEvent}</span>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-gray-700 text-xs">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">Climate Events</h4>
          <div className="space-y-2">
            {[
              { type: 'bushfires', label: 'Bushfires', icon: '🔥', color: 'text-red-600' },
              { type: 'floods', label: 'Floods', icon: '🌊', color: 'text-blue-600' },
              { type: 'droughts', label: 'Droughts', icon: '🌵', color: 'text-yellow-600' }
            ].map(item => {
              const count = filteredEvents.filter(e => e.type === item.type).length;
              const isActive = activeFilters.includes(item.type);
              
              return (
                <div key={item.type} className={`flex items-center space-x-2 text-xs ${
                  isActive ? 'opacity-100' : 'opacity-40'
                }`}>
                  <span className="text-sm">{item.icon}</span>
                  <span className={`font-medium ${item.color}`}>{item.label}</span>
                  <span className="text-gray-500">({count})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Event count indicator */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-800">
              {filteredEvents.length} events displayed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateMapView;
