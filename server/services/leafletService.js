// Utility functions for processing map data and coordinates

const processLocationData = (locationData) => {
  if (!locationData) return null;
  
  return {
    name: locationData.display_name || locationData.name,
    coordinates: [parseFloat(locationData.lat), parseFloat(locationData.lon)],
    address: locationData.address || {},
    boundingBox: locationData.boundingbox || null,
    type: locationData.type || 'location',
    importance: locationData.importance || 0
  };
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

const getBoundingBox = (locations) => {
  if (!locations || locations.length === 0) return null;
  
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;
  
  locations.forEach(location => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
  });
  
  return {
    southwest: [minLat, minLon],
    northeast: [maxLat, maxLon]
  };
};

const filterAustralianLocations = (locations) => {
  return locations.filter(location => {
    const country = location.address?.country;
    return country === 'Australia' || country === 'AU';
  });
};

const formatMapMarkers = (locations, type = 'location') => {
  return locations.map(location => ({
    position: [parseFloat(location.lat), parseFloat(location.lon)],
    popup: location.display_name || location.name,
    type: type,
    data: location
  }));
};

module.exports = {
  processLocationData,
  calculateDistance,
  getBoundingBox,
  filterAustralianLocations,
  formatMapMarkers
};
