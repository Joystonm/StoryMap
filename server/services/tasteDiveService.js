const axios = require('axios');

const getCulturalRecommendations = async (location) => {
  const apiKey = process.env.TASTEDIVE_API_KEY;
  
  if (!apiKey) {
    console.log('TasteDive API key not configured, using fallback data');
    return getFallbackRecommendations(location);
  }

  try {
    console.log('Making TasteDive API request for location:', location);
    
    // Extract main location name for better API results
    const locationName = location.split(',')[0].trim();
    
    // Get music recommendations with proper URL format
    const musicUrl = `https://tastedive.com/api/similar?q=${encodeURIComponent(locationName + ' Australia music')}&type=music&info=1&limit=5&k=${apiKey}`;
    
    console.log('TasteDive music URL:', musicUrl);
    
    const musicResponse = await axios.get(musicUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'StoryMap.ai/1.0'
      }
    });

    console.log('TasteDive music response status:', musicResponse.status);
    console.log('TasteDive music data:', JSON.stringify(musicResponse.data, null, 2));

    // Get movie recommendations
    const movieUrl = `https://tastedive.com/api/similar?q=${encodeURIComponent(locationName + ' Australia')}&type=movie&info=1&limit=3&k=${apiKey}`;
    
    const movieResponse = await axios.get(movieUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'StoryMap.ai/1.0'
      }
    });

    console.log('TasteDive movie response status:', movieResponse.status);

    return {
      music: `Music recommendations for ${location}`,
      musicItems: (musicResponse.data?.similar?.results || []).map(item => ({
        name: item.name,
        type: item.type || 'Music',
        description: item.description || 'Musical artist or band',
        url: item.wUrl
      })),
      
      art: `Cultural media from ${location}`,
      artItems: (movieResponse.data?.similar?.results || []).map(item => ({
        name: item.name,
        type: item.type || 'Media',
        description: item.description || 'Cultural content',
        url: item.wUrl
      })),
      
      food: `Culinary traditions of ${location}`,
      foodItems: [
        { name: 'Bush Tucker', type: 'Traditional', description: 'Native Australian ingredients and dishes' },
        { name: 'Local Specialties', type: 'Regional', description: 'Signature dishes and regional favorites' },
        { name: 'Modern Australian', type: 'Contemporary', description: 'Contemporary fusion cuisine' }
      ],
      
      traditions: `Cultural heritage of ${location}`,
      raw_data: {
        music: musicResponse.data,
        movies: movieResponse.data
      }
    };
  } catch (error) {
    console.error('TasteDive API error details:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    
    console.log('Using fallback recommendations for:', location);
    return getFallbackRecommendations(location);
  }
};

const getFallbackRecommendations = (location) => {
  const locationName = location.split(',')[0].trim();
  
  return {
    music: `Traditional and contemporary music from the ${locationName} region`,
    musicItems: [
      { name: 'Aboriginal Musicians', type: 'Traditional', description: 'Indigenous artists and songlines from the region' },
      { name: 'Country Music', type: 'Folk', description: 'Australian country and folk traditions' },
      { name: 'Local Bands', type: 'Contemporary', description: 'Modern musical acts from the area' },
      { name: 'Folk Artists', type: 'Traditional', description: 'Regional folk and acoustic performers' }
    ],
    
    art: `Visual arts and cultural expressions from ${locationName}`,
    artItems: [
      { name: 'Indigenous Art', type: 'Traditional', description: 'Aboriginal dot paintings and rock art' },
      { name: 'Local Galleries', type: 'Contemporary', description: 'Modern Australian art spaces and exhibitions' },
      { name: 'Street Art', type: 'Urban', description: 'Contemporary murals and public art' },
      { name: 'Photography', type: 'Documentary', description: 'Landscape and cultural photography' }
    ],
    
    food: `Culinary heritage and local specialties of ${locationName}`,
    foodItems: [
      { name: 'Bush Tucker', type: 'Traditional', description: 'Native Australian ingredients and dishes' },
      { name: 'Local Specialties', type: 'Regional', description: 'Signature dishes and regional favorites' },
      { name: 'Modern Australian', type: 'Contemporary', description: 'Contemporary fusion cuisine' },
      { name: 'Pub Food', type: 'Classic', description: 'Traditional Australian pub meals' }
    ],
    
    traditions: `Cultural practices and heritage of ${locationName}`,
    raw_data: null
  };
};

module.exports = {
  getCulturalRecommendations
};
