import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CulturalInsights from '../components/CulturalInsights';
import LocationSearch from '../components/LocationSearch';
import { useLocationContext } from '../contexts/LocationContext';
import apiClient from '../utils/apiClient';

const Explore = () => {
  const { selectedLocation, updateLocation } = useLocationContext();
  const [insights, setInsights] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCulturalInsights = async (location) => {
    setLoading(true);
    setError('');
    setInsights(null);
    
    try {
      console.log('Fetching cultural insights for:', location.name);
      
      const response = await apiClient.get(`/culture/insights?location=${encodeURIComponent(location.name)}`);
      
      setInsights(response.data.insights);
      setMetadata(response.data.metadata);
    } catch (err) {
      console.error('Cultural insights error:', err);
      setError('Failed to fetch cultural insights. Please try again.');
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    updateLocation(location);
    fetchCulturalInsights(location);
  };

  // Auto-load insights if location exists
  useEffect(() => {
    if (selectedLocation && !insights && !loading) {
      fetchCulturalInsights(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-green-600 hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Outback Culture Explorer</h1>
          <p className="text-gray-600 mt-2">Discover live cultural insights from across Australia</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-white/20 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Location Info */}
        {selectedLocation && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-green-800 mb-2">Exploring Cultural Insights for:</h3>
            <p className="text-green-700">{selectedLocation.name}</p>
            {metadata && (
              <div className="mt-2 flex space-x-3 text-xs">
                <span className={`px-2 py-1 rounded bg-blue-100 text-blue-800`}>
                  🎭 Culture: {'Available'}
                </span>
                <span className={`px-2 py-1 rounded bg-purple-100 text-purple-800`}>
                  📅 Events: {'Available'}
                </span>
                <span className={`px-2 py-1 rounded bg-orange-100 text-orange-800`}>
                  🏛️ Landmarks: {'Available'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Cultural Insights */}
        <CulturalInsights insights={insights} loading={loading} metadata={metadata} />

        {/* Empty State */}
        {!selectedLocation && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Explore Culture?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Search for any Australian location above to discover live cultural insights including music, art, food, and local events.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;

