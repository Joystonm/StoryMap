import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClimateMapView from '../components/ClimateMapView';
import LocationSearch from '../components/LocationSearch';

const ClimateMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [allClimateEvents, setAllClimateEvents] = useState([]);
  const [locationWeather, setLocationWeather] = useState(null);
  const [locationEvents, setLocationEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Static climate events data - comprehensive historical events
  const staticClimateEvents = [
    // Major Bushfire Events
    {
      id: 1,
      type: 'Bushfire',
      location: 'Black Summer - NSW',
      year: 2020,
      severity: 'Extreme',
      description: 'Black Summer bushfires devastated NSW communities, burning 5.5 million hectares',
      impact: '33 deaths, 3,000+ homes destroyed, 1 billion animals killed',
      coordinates: [-33.4569, 150.7944]
    },
    {
      id: 2,
      type: 'Bushfire',
      location: 'East Gippsland - VIC',
      year: 2020,
      severity: 'Extreme',
      description: 'East Gippsland fires destroyed 1.5 million hectares during Black Summer',
      impact: '5 deaths, 300+ homes destroyed, massive wildlife losses',
      coordinates: [-37.5622, 148.1847]
    },
    {
      id: 3,
      type: 'Bushfire',
      location: 'Ash Wednesday - SA/VIC',
      year: 1983,
      severity: 'Extreme',
      description: 'Ash Wednesday fires were among Australia\'s worst natural disasters',
      impact: '75 deaths, 2,545 homes destroyed, 210,000 hectares burned',
      coordinates: [-34.9285, 138.8007]
    },
    {
      id: 4,
      type: 'Bushfire',
      location: 'Black Friday - VIC',
      year: 1939,
      severity: 'Extreme',
      description: 'Black Friday fires burned 2 million hectares across Victoria',
      impact: '71 deaths, entire towns destroyed, changed fire management forever',
      coordinates: [-37.0201, 145.7781]
    },
    {
      id: 5,
      type: 'Bushfire',
      location: 'Canberra - ACT',
      year: 2003,
      severity: 'High',
      description: 'Canberra bushfires reached the suburbs, unprecedented urban fire',
      impact: '4 deaths, 500+ homes destroyed, $350M damage',
      coordinates: [-35.2809, 149.1300]
    },
    
    // Major Flood Events
    {
      id: 6,
      type: 'Flood',
      location: 'Lismore - NSW',
      year: 2022,
      severity: 'Extreme',
      description: 'Record-breaking floods devastated Northern NSW, highest ever recorded',
      impact: '22 deaths, 25,000+ evacuated, $4.8B damage',
      coordinates: [-28.8142, 153.2781]
    },
    {
      id: 7,
      type: 'Flood',
      location: 'Brisbane - QLD',
      year: 2011,
      severity: 'Extreme',
      description: 'Queensland floods affected 78% of the state, worst in 120 years',
      impact: '35 deaths, 20,000+ homes flooded, $2.38B damage',
      coordinates: [-27.4698, 153.0251]
    },
    {
      id: 8,
      type: 'Flood',
      location: 'Townsville - QLD',
      year: 2019,
      severity: 'Major',
      description: 'Monsoon flooding inundated Townsville, 1-in-500-year event',
      impact: '3 deaths, 3,300+ homes damaged, mass evacuations',
      coordinates: [-19.2590, 146.8169]
    },
    {
      id: 9,
      type: 'Flood',
      location: 'Katherine - NT',
      year: 1998,
      severity: 'Major',
      description: 'Katherine River flooding, worst in recorded history',
      impact: '1 death, 2,000+ evacuated, town underwater for weeks',
      coordinates: [-14.4669, 132.2647]
    },
    {
      id: 10,
      type: 'Flood',
      location: 'Hunter Valley - NSW',
      year: 2007,
      severity: 'Major',
      description: 'Pasha Bulker storm caused severe flooding across Hunter Valley',
      impact: '11 deaths, 300+ homes flooded, $1.5B damage',
      coordinates: [-32.7335, 151.5027]
    },
    
    // Major Drought Events
    {
      id: 11,
      type: 'Drought',
      location: 'Millennium Drought - Murray-Darling',
      year: 2006,
      severity: 'Extreme',
      description: 'Millennium Drought (1997-2009) was Australia\'s worst recorded drought',
      impact: '$9B agricultural losses, 41% drop in rice production, river systems collapsed',
      coordinates: [-34.0522, 142.0251]
    },
    {
      id: 12,
      type: 'Drought',
      location: 'Federation Drought - Eastern Australia',
      year: 1902,
      severity: 'Extreme',
      description: 'Federation Drought (1895-1903) devastated eastern Australia',
      impact: '40% livestock losses, mass migration to cities, economic collapse',
      coordinates: [-33.8688, 151.2093]
    },
    {
      id: 13,
      type: 'Drought',
      location: 'Central Queensland',
      year: 2019,
      severity: 'Extreme',
      description: 'Extended drought conditions across Central Queensland grazing areas',
      impact: '100% of QLD in drought, $8B agricultural losses, mass cattle deaths',
      coordinates: [-23.3382, 150.5150]
    },
    {
      id: 14,
      type: 'Drought',
      location: 'Wheatbelt - WA',
      year: 2010,
      severity: 'High',
      description: 'Severe drought affected Western Australian Wheatbelt region',
      impact: '30% crop yield reduction, $2B losses, water restrictions',
      coordinates: [-31.0000, 117.8833]
    },
    {
      id: 15,
      type: 'Drought',
      location: 'Big Dry - Southeast Australia',
      year: 2002,
      severity: 'Extreme',
      description: 'The Big Dry affected southeast Australia for over a decade',
      impact: 'Water restrictions, $5B agricultural losses, ecological damage',
      coordinates: [-35.3075, 149.1244]
    }
  ];

  // Set static events on component mount
  useEffect(() => {
    console.log('Setting static climate events:', staticClimateEvents.length);
    setAllClimateEvents(staticClimateEvents);
    setMapLoading(false);
  }, []);

  // Combine static events with location-specific events for map display
  const allEventsForMap = [...allClimateEvents, ...locationEvents];

  // Fetch location-specific weather and climate events
  const fetchLocationData = async (location) => {
    if (!location) return;
    
    setLoading(true);
    console.log('Fetching data for location:', location.name);
    
    try {
      // Fetch current weather from OpenWeatherMap
      const weatherApiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      
      if (weatherApiKey) {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${weatherApiKey}&units=metric`
        );
        
        const weatherData = await weatherResponse.json();
        console.log('OpenWeatherMap data:', weatherData);
        
        if (weatherData.main) {
          setLocationWeather({
            location: location.name,
            temperature: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind?.speed || 0,
            icon: weatherData.weather[0].icon,
            source: 'OpenWeatherMap'
          });
        }
      } else {
        setLocationWeather({
          location: location.name,
          temperature: 22,
          description: 'Clear sky',
          humidity: 65,
          windSpeed: 5,
          source: 'Fallback'
        });
      }
      
      // Fetch historical climate events using Tavily
      const tavilyApiKey = process.env.REACT_APP_TAVILY_API_KEY;
      
      if (tavilyApiKey) {
        const eventsResponse = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: tavilyApiKey,
            query: `${location.name} Australia climate events bushfires floods droughts history disasters`,
            search_depth: 'advanced',
            include_answer: true,
            max_results: 8
          })
        });
        
        const eventsData = await eventsResponse.json();
        console.log('Events data:', eventsData);
        
        if (eventsData.results?.length > 0) {
          const locationClimateEvents = eventsData.results.map((result, index) => ({
            id: `loc-${index + 1}`,
            type: result.title?.toLowerCase().includes('fire') ? 'Bushfire' :
                  result.title?.toLowerCase().includes('flood') ? 'Flood' : 'Drought',
            location: location.name,
            year: extractYear(result.content) || 2023,
            severity: 'Moderate',
            description: result.content?.substring(0, 150) + '...' || 'Climate event',
            impact: 'Local community impact',
            coordinates: [
              typeof location.lat === 'number' ? location.lat : -25.2744,
              typeof location.lng === 'number' ? location.lng : 133.7751
            ],
            source: 'Tavily API'
          }));
          
          setLocationEvents(locationClimateEvents);
          console.log('Location events:', locationClimateEvents);
        }
      } else {
        // Fallback events
        setLocationEvents([
          {
            id: 'fallback-1',
            type: 'Bushfire',
            location: location.name,
            year: 2020,
            severity: 'Moderate',
            description: `Historical bushfire events in ${location.name} area`,
            impact: 'Community and environmental impact',
            coordinates: [
              typeof location.lat === 'number' ? location.lat : -25.2744,
              typeof location.lng === 'number' ? location.lng : 133.7751
            ],
            source: 'Fallback'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLocationWeather({
        location: location.name,
        temperature: '--',
        description: 'Unable to fetch weather data',
        source: 'Error'
      });
      setLocationEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract year from text
  const extractYear = (text) => {
    if (!text) return null;
    const yearMatch = text.match(/20(19|20|21|22|23|24)/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    fetchLocationData(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors">
                <span className="text-2xl">🌍</span>
                <span className="font-bold text-xl">StoryMap.ai</span>
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">🌡️ Climate Memory Map</h1>
            </div>
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 py-6">
        <div className="flex flex-col gap-6">
          
          {/* Search Section */}
          <div className="w-full">
            {/* Location Search */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Explore Climate Events</h2>
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                placeholder="Search Australian locations..."
              />
              <p className="text-sm text-gray-600 mt-3">
                Discover climate events across Australia including bushfires, floods, and droughts.
              </p>
            </div>
          </div>

          {/* Location Events Section */}
          {locationEvents.length > 0 && (
            <div className="w-full px-4 py-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Location Events</h3>
                      <p className="text-sm text-gray-500">{selectedLocation?.name}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-blue-700">{locationEvents.length} events</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6">
                  {locationEvents.map((event) => (
                    <div key={event.id} className="w-full group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                      {/* Event type indicator */}
                      <div className={`absolute top-0 left-0 w-full h-1 ${
                        event.type === 'Bushfire' ? 'bg-red-400' : 
                        event.type === 'Flood' ? 'bg-blue-400' : 'bg-yellow-400'
                      }`}></div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              event.type === 'Bushfire' ? 'bg-red-100 text-red-600' : 
                              event.type === 'Flood' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              <span className="text-lg">
                                {event.type === 'Bushfire' ? '🔥' : 
                                 event.type === 'Flood' ? '🌊' : '🌵'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-sm mb-1">{event.type}</h4>
                              <p className="text-xs text-gray-500">{event.year}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            event.severity === 'Extreme' ? 'bg-red-100 text-red-700' :
                            event.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {event.severity}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Historical Timeline Section */}
          <div className="w-full px-4 py-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Historical Timeline</h3>
                    <p className="text-sm text-gray-500">Major Climate Events</p>
                  </div>
                </div>
                <div className="bg-purple-50 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold text-purple-700">{staticClimateEvents.length} events</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 max-h-96 overflow-y-auto pr-2">
                {staticClimateEvents
                  .sort((a, b) => b.year - a.year)
                  .map((event, index) => (
                    <div key={event.id} className="w-full group relative bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
                      {/* Year badge */}
                      <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs font-bold z-10">
                        {event.year}
                      </div>
                      
                      {/* Event type indicator */}
                      <div className={`absolute top-0 left-0 w-full h-1 ${
                        event.type === 'Bushfire' ? 'bg-red-400' : 
                        event.type === 'Flood' ? 'bg-blue-400' : 'bg-yellow-400'
                      }`}></div>
                      
                      <div className="p-4 flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          event.type === 'Bushfire' ? 'bg-red-100 text-red-600' : 
                          event.type === 'Flood' ? 'bg-blue-100 text-blue-600' : 
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          <span className="text-sm">
                            {event.type === 'Bushfire' ? '🔥' : 
                             event.type === 'Flood' ? '🌊' : '🌵'}
                          </span>
                        </div>
                        <div className="flex-1 pr-8">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {event.location}
                            </h4>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              event.severity === 'Extreme' ? 'bg-red-100 text-red-700' :
                              event.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {event.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-500 italic">
                            {event.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span>Bushfires ({staticClimateEvents.filter(e => e.type === 'Bushfire').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>Floods ({staticClimateEvents.filter(e => e.type === 'Flood').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>Droughts ({staticClimateEvents.filter(e => e.type === 'Drought').length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateMap;
