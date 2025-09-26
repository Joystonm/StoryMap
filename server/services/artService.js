const tavilyService = require('./tavilyService');

const getArtByLocation = async (location) => {
  try {
    const locationName = location.split(',')[0].trim();
    
    // Search for galleries, museums, and artists in the location
    const queries = [
      `art galleries museums ${locationName} Australia`,
      `artists painters sculptors ${locationName} Australia`,
      `cultural centers exhibitions ${locationName} Australia`
    ];

    const searchPromises = queries.map(query => 
      tavilyService.searchCultural(query, { maxResults: 3 })
    );

    const results = await Promise.allSettled(searchPromises);
    
    const allResults = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .flatMap(result => result.value.results || []);

    if (allResults.length === 0) {
      return null; // No local results found
    }

    // Filter and categorize results
    const artItems = allResults
      .filter(item => {
        const title = item.title?.toLowerCase() || '';
        const content = item.content?.toLowerCase() || '';
        const url = item.url?.toLowerCase() || '';
        
        // Check if result is actually about art/culture and location-specific
        const isArtRelated = title.includes('gallery') || title.includes('museum') || 
                           title.includes('artist') || title.includes('art') ||
                           content.includes('exhibition') || content.includes('painting');
        
        const isLocationSpecific = title.includes(locationName.toLowerCase()) ||
                                 content.includes(locationName.toLowerCase()) ||
                                 url.includes(locationName.toLowerCase().replace(/\s+/g, ''));
        
        return isArtRelated && isLocationSpecific;
      })
      .slice(0, 6)
      .map(item => ({
        name: item.title,
        type: determineArtType(item.title, item.content),
        description: item.content?.substring(0, 150) + '...' || 'Cultural venue or artist',
        url: item.url,
        location: locationName
      }));

    return artItems.length > 0 ? { items: artItems } : null;
    
  } catch (error) {
    console.error('Art service error:', error.message);
    return null;
  }
};

const determineArtType = (title, content) => {
  const text = (title + ' ' + content).toLowerCase();
  
  if (text.includes('gallery')) return 'Gallery';
  if (text.includes('museum')) return 'Museum';
  if (text.includes('artist') || text.includes('painter')) return 'Artist';
  if (text.includes('sculpture')) return 'Sculpture';
  if (text.includes('exhibition')) return 'Exhibition';
  if (text.includes('cultural center')) return 'Cultural Center';
  
  return 'Art Venue';
};

module.exports = {
  getArtByLocation
};
