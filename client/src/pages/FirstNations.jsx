import React, { useState } from 'react';
import { useLocationContext } from '../contexts/LocationContext';
import LocationSearch from '../components/LocationSearch';
import FirstNationsCulturalHub from '../components/FirstNationsCulturalHub';
import MapView from '../components/MapView';

const FirstNations = () => {
  const { selectedLocation, updateLocation } = useLocationContext();
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelect = (location) => {
    updateLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            First Nations Cultural Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore Indigenous culture, languages, and traditional knowledge. 
            Learn about Dreamtime stories and connect with cultural heritage.
          </p>
        </div>

        <div className="mb-8">
          <LocationSearch 
            placeholder="Search for a region to explore Indigenous culture..." 
            onLocationSelect={handleLocationSelect}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {selectedLocation ? (
              <FirstNationsCulturalHub location={selectedLocation.name} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">First Nations Cultural Hub</h2>
                <p className="text-gray-600">Please search for a location to explore Indigenous cultural content.</p>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Cultural Map</h3>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
              </div>
              {showMap && (
                <div className="h-96">
                  <MapView selectedLocation={selectedLocation} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstNations;
