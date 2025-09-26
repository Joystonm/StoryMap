import { useState, useCallback } from 'react';

const useMapInteraction = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([-25.2744, 133.7751]); // Australia center
  const [zoom, setZoom] = useState(5);
  const [markers, setMarkers] = useState([]);

  const addMarker = useCallback((position, popup) => {
    const newMarker = { position, popup };
    setMarkers(prev => [...prev, newMarker]);
  }, []);

  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  const updateMapView = useCallback((center, newZoom = zoom) => {
    setMapCenter(center);
    setZoom(newZoom);
  }, [zoom]);

  const handleLocationClick = useCallback((location) => {
    setSelectedLocation(location);
    if (location.coordinates) {
      updateMapView(location.coordinates, 10);
      addMarker(location.coordinates, location.name);
    }
  }, [updateMapView, addMarker]);

  return {
    selectedLocation,
    mapCenter,
    zoom,
    markers,
    addMarker,
    clearMarkers,
    updateMapView,
    handleLocationClick
  };
};

export default useMapInteraction;
