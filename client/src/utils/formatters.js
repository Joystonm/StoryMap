// Format location data for display
export const formatLocation = (location) => {
  if (!location) return null;
  
  return {
    name: location.display_name || location.name || 'Unknown Location',
    coordinates: location.lat && location.lon ? [parseFloat(location.lat), parseFloat(location.lon)] : null,
    country: location.address?.country || 'Unknown',
    state: location.address?.state || location.address?.region || 'Unknown'
  };
};

// Format climate data for visualization
export const formatClimateData = (data) => {
  if (!data) return null;
  
  return {
    temperature: data.temperature ? `${Math.round(data.temperature)}` : 'N/A',
    rainfall: data.rainfall ? `${Math.round(data.rainfall)}` : 'N/A',
    wind: data.wind_speed ? `${Math.round(data.wind_speed)}` : 'N/A'
  };
};

// Format story content
export const formatStory = (story) => {
  if (!story) return null;
  
  return {
    title: story.title || 'Untitled Story',
    content: story.content || story.narrative || 'No content available',
    location: story.location || 'Unknown Location',
    timestamp: story.created_at || new Date().toISOString()
  };
};

// Format cultural insights
export const formatCulturalInsights = (insights) => {
  if (!insights) return null;
  
  return {
    music: insights.music || insights.musical_traditions || 'No music information available',
    art: insights.art || insights.visual_arts || 'No art information available',
    food: insights.food || insights.cuisine || 'No food information available',
    traditions: insights.traditions || insights.cultural_practices || 'No tradition information available'
  };
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Format coordinates for display
export const formatCoordinates = (lat, lon) => {
  if (!lat || !lon) return 'Coordinates not available';
  
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
};
