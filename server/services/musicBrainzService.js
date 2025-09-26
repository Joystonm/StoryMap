const axios = require('axios');

const getMusicByLocation = async (location) => {
  try {
    const locationName = location.split(',')[0].trim();
    
    // Search for artists from the location
    const artistUrl = `https://musicbrainz.org/ws/2/artist?query=area:"${encodeURIComponent(locationName)}" OR begin-area:"${encodeURIComponent(locationName)}"&fmt=json&limit=10`;
    
    const response = await axios.get(artistUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'StoryMap.ai/1.0 (contact@storymap.ai)'
      }
    });

    const artists = response.data.artists || [];
    
    // Filter for Australian artists and validate location relevance
    const relevantArtists = artists.filter(artist => {
      const area = artist.area?.name || artist['begin-area']?.name || '';
      const country = artist.area?.['iso-3166-1-codes']?.[0] || artist['begin-area']?.['iso-3166-1-codes']?.[0];
      
      return country === 'AU' || area.toLowerCase().includes('australia') || 
             area.toLowerCase().includes(locationName.toLowerCase());
    });

    if (relevantArtists.length === 0) {
      return null; // No local results found
    }

    return {
      artists: relevantArtists.slice(0, 5).map(artist => ({
        name: artist.name,
        type: artist.type || 'Artist',
        description: `${artist.type || 'Musical artist'} from ${artist.area?.name || artist['begin-area']?.name || locationName}`,
        genres: artist.tags?.map(tag => tag.name).slice(0, 3) || [],
        url: `https://musicbrainz.org/artist/${artist.id}`,
        disambiguation: artist.disambiguation || null
      }))
    };
  } catch (error) {
    console.error('MusicBrainz API error:', error.message);
    return null;
  }
};

module.exports = {
  getMusicByLocation
};
