import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LocationContext = createContext();

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Load location from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationData = params.get('location');
    
    if (locationData && !selectedLocation) {
      try {
        const parsedLocation = JSON.parse(decodeURIComponent(locationData));
        setSelectedLocation(parsedLocation);
      } catch (error) {
        console.error('Failed to parse location from URL:', error);
      }
    }
  }, [location.search, selectedLocation]);

  const updateLocation = (newLocation) => {
    setSelectedLocation(newLocation);
    setError('');
    
    // Update URL with location data
    if (newLocation) {
      const params = new URLSearchParams(location.search);
      params.set('location', encodeURIComponent(JSON.stringify(newLocation)));
      const newUrl = `${location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const navigateWithLocation = (path) => {
    if (selectedLocation) {
      const params = new URLSearchParams();
      params.set('location', encodeURIComponent(JSON.stringify(selectedLocation)));
      navigate(`${path}?${params.toString()}`);
    } else {
      navigate(path);
    }
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSelectedStory(null);
    setError('');
    
    // Remove location from URL
    const params = new URLSearchParams(location.search);
    params.delete('location');
    const newUrl = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    window.history.replaceState(null, '', newUrl);
  };

  const value = {
    selectedLocation,
    selectedStory,
    loading,
    error,
    setSelectedStory,
    setLoading,
    setError,
    updateLocation,
    navigateWithLocation,
    clearLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
