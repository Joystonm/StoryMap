import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClimateMapView from '../components/ClimateMapView';
import LocationSearch from '../components/LocationSearch';

const ClimateMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [climateEvents, setClimateEvents] = useState([]);
  const [allClimateEvents, setAllClimateEvents] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(['bushfires', 'floods', 'droughts']);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventTypes = [
    { id: 'bushfires', label: 'Bushfires', icon: '🔥', color: 'bg-red-500', activeColor: 'bg-red-600' },
    { id: 'floods', label: 'Floods', icon: '🌊', color: 'bg-blue-500', activeColor: 'bg-blue-600' },
    { id: 'droughts', label: 'Droughts', icon: '🌵', color: 'bg-yellow-500', activeColor: 'bg-yellow-600' }
  ];

  // Fetch all climate events for map display
  useEffect(() => {
    const fetchAllClimateEvents = async () => {
      setMapLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/climate/events/all');
        const data = await response.json();
        if (data.success) {
          setAllClimateEvents(data.events);
        }
      } catch (error) {
        console.error('Error fetching all climate events:', error);
      } finally {
        setMapLoading(false);
      }
    };

    fetchAllClimateEvents();
  }, []);

  const fetchWeatherData = async (location) => {
    if (!location?.lat || !location?.lon) return;
    
    setWeatherLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/weather?lat=${location.lat}&lon=${location.lon}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleLocationSelect = async (location) => {
    setLoading(true);
    setSelectedLocation(location);
    
    // Fetch climate events for specific location
    try {
      const response = await fetch(`http://localhost:5000/api/climate/events?location=${encodeURIComponent(location.name)}`);
      const data = await response.json();
      setClimateEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching climate data:', error);
      setClimateEvents([]);
    } finally {
      setLoading(false);
    }

    // Fetch weather data
    fetchWeatherData(location);
  };

  const toggleFilter = (filterId) => {
    setActiveFilters(prev => {
      const newFilters = prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];
      
      // Ensure at least one filter is always active
      return newFilters.length > 0 ? newFilters : [filterId];
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    // Optionally zoom to event location
    setSelectedLocation({
      name: event.location,
      lat: event.lat,
      lon: event.lon,
      coordinates: [event.lat, event.lon]
    });
  };

  // Filter events based on active filters
  const filteredEvents = climateEvents.filter(event => 
    activeFilters.includes(event.type)
  );

  // Filter map events based on active filters
  const filteredMapEvents = allClimateEvents.filter(event => 
    activeFilters.includes(event.type)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium">
            ← Back to Home
          </Link>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-gray-900">Climate Memory Map</h1>
            <p className="text-gray-600 mt-1">Historical climate events and future projections</p>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden" style={{ height: '500px' }}>
              {mapLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading climate events...</p>
                  </div>
                </div>
              ) : (
                <ClimateMapView 
                  climateEvents={filteredMapEvents}
                  activeFilters={activeFilters}
                  onEventClick={handleEventClick}
                />
              )}
            </div>
          </div>

          {/* Filters and Weather */}
          <div className="space-y-6">
            {/* Event Type Filters */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
              <div className="space-y-3">
                {eventTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleFilter(type.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all transform hover:scale-105 ${
                      activeFilters.includes(type.id)
                        ? `${type.activeColor} text-white shadow-lg ring-2 ring-offset-2 ring-${type.color.split('-')[1]}-300`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                    {activeFilters.includes(type.id) && (
                      <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded-full">
                        {allClimateEvents.filter(e => e.type === type.id).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Data */}
            {selectedLocation && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🌤️</span>
                  Current Weather
                </h3>
                {weatherLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Temperature</span>
                      <span className="font-semibold text-2xl text-orange-600">
                        {Math.round(weatherData.temperature)}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Condition</span>
                      <span className="font-medium capitalize">{weatherData.condition}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Humidity</span>
                      <span className="font-medium">{weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rain Chance</span>
                      <span className="font-medium text-blue-600">{weatherData.rainChance || 0}%</span>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Feels like:</span> {Math.round(weatherData.feelsLike || weatherData.temperature)}°C
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <div className="text-2xl mb-2">📍</div>
                    <p className="text-sm">Weather data unavailable</p>
                  </div>
                )}
              </div>
            )}

            {/* Selected Event Details */}
            {selectedEvent && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>
                    {selectedEvent.type === 'bushfires' ? '🔥' : 
                     selectedEvent.type === 'floods' ? '🌊' : '🌵'}
                  </span>
                  Selected Event
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Location:</span>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Event Count:</span>
                    <p className="font-medium">{selectedEvent.count} events</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Severity:</span>
                    <p className={`font-medium capitalize ${
                      selectedEvent.severity === 'high' ? 'text-red-600' :
                      selectedEvent.severity === 'medium' ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {selectedEvent.severity}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Description:</span>
                    <p className="text-sm text-gray-700">{selectedEvent.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            )}

            {/* Timeline Summary */}
            {selectedLocation && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Climate Events: {selectedLocation.name}
                </h3>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      Showing {filteredEvents.length} events
                    </div>
                    <div className="flex gap-2">
                      {activeFilters.map(filterId => {
                        const type = eventTypes.find(t => t.id === filterId);
                        return (
                          <span key={filterId} className={`text-xs px-2 py-1 rounded-full text-white ${type.color}`}>
                            {type.icon} {type.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        {selectedLocation && !loading && (
          <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Historical Events & Projections ({filteredEvents.length} events)
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Historical</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Good Scenario</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Bad Scenario</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              {/* Filtered Events */}
              <div className="space-y-6">
                {filteredEvents.map((event, index) => {
                  const eventType = eventTypes.find(t => t.id === event.type);
                  return (
                    <div key={event.id || index} className="relative flex items-start gap-4">
                      <div className={`w-8 h-8 ${eventType.color} rounded-full flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg`}>
                        {eventType.icon}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <span className="text-sm text-gray-500">{event.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{event.description}</p>
                        {event.severity && (
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            event.severity === 'extreme' ? 'bg-red-100 text-red-800' :
                            event.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {event.severity} severity
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Future Projections */}
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                    📈
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-blue-900">Good Scenario 2030-2050</h4>
                      <span className="text-sm text-blue-600">Projection</span>
                    </div>
                    <p className="text-blue-800 text-sm">With effective climate action: Reduced fire risk, improved water security.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                    ⚠️
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-red-900">Bad Scenario 2030-2050</h4>
                      <span className="text-sm text-red-600">Projection</span>
                    </div>
                    <p className="text-red-800 text-sm">Without climate action: Increased extreme weather events, water scarcity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateMap;
