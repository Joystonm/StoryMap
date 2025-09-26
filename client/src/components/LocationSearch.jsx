import React, { useState, useEffect } from 'react';
import { useLocationContext } from '../contexts/LocationContext';
import apiClient from '../utils/apiClient';

const LocationSearch = ({ onLocationSelect }) => {
  const { selectedLocation } = useLocationContext();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set initial query from persisted location only once
  useEffect(() => {
    if (selectedLocation && !query) {
      setQuery(selectedLocation.name || '');
    }
  }, [selectedLocation]);

  const searchLocation = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await apiClient.get(`/location/search?query=${encodeURIComponent(searchQuery)}`);
      setSuggestions(response.data);
      
      if (response.data.length === 0) {
        setError('No locations found. Try a different search term.');
      }
    } catch (err) {
      setError('Failed to search locations. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (!value.trim()) {
      setSuggestions([]);
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const location = {
      name: suggestion.display_name || suggestion.name,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      coordinates: [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
    };
    
    setQuery(location.name);
    setSuggestions([]);
    setError('');
    onLocationSelect(location);
  };

  const handleInputFocus = () => {
    // Clear suggestions when focusing to allow new search
    if (suggestions.length === 0 && query) {
      searchLocation(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setError('');
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            placeholder="Enter a location to uncover its story…"
            className="w-full px-6 py-4 text-lg text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
            </div>
          )}
          {query && !loading && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        <button
          onClick={() => searchLocation(query)}
          disabled={loading || !query.trim()}
          className="px-6 py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-medium hover:from-orange-600 hover:to-rose-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Generate Story</span>
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-4 hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 group"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-100 to-rose-100 rounded-full flex items-center justify-center group-hover:from-orange-200 group-hover:to-rose-200 transition-all">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {suggestion.display_name || suggestion.name}
                  </div>
                  {suggestion.address && (
                    <div className="text-sm text-gray-500 mt-1">
                      {suggestion.address.state && `${suggestion.address.state}, `}
                      {suggestion.address.country}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
