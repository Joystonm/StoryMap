import axios from 'axios';

const getFallbackRecommendations = (location) => {
  const recommendations = {
    'Sydney': {
      music: ['Midnight Oil', 'INXS', 'Silverchair'],
      movies: ['The Castle', 'Muriel\'s Wedding'],
      books: ['Cloudstreet', 'The Thorn Birds']
    },
    'Melbourne': {
      music: ['Nick Cave', 'Crowded House', 'Jet'],
      movies: ['Animal Kingdom', 'The Dish'],
      books: ['The Secret River', 'Picnic at Hanging Rock']
    },
    'Brisbane': {
      music: ['Powderfinger', 'Savage Garden', 'The Saints'],
      movies: ['Crocodile Dundee', 'Australia'],
      books: ['The Book Thief', 'Shantaram']
    }
  };

  const cityRecs = recommendations[location] || recommendations['Sydney'];
  
  return {
    musicItems: cityRecs.music.map(name => ({
      name,
      artist: 'Australian Artist',
      genre: 'Australian Music',
      description: `Popular Australian artist from the ${location} music scene`
    })),
    movieItems: cityRecs.movies.map(name => ({
      name,
      type: 'Movie', 
      description: `Australian film featuring themes from ${location}`
    })),
    bookItems: cityRecs.books.map(name => ({
      name,
      type: 'Book',
      description: `Australian literature with connections to ${location}`
    }))
  };
};

export const getCulturalRecommendations = async (location) => {
  const apiKey = process.env.REACT_APP_TASTEDIVE_API_KEY;
  
  console.log('TasteDive API check:', {
    hasKey: !!apiKey,
    location,
    keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
  });
  
  if (!apiKey) {
    console.log('No TasteDive API key found, using fallback');
    return getFallbackRecommendations(location);
  }

  try {
    const locationName = location.split(',')[0].trim();
    console.log('Making TasteDive API request for:', locationName);
    
    // Get music recommendations
    const musicUrl = `https://tastedive.com/api/similar?q=${encodeURIComponent(locationName + ' Australia music')}&type=music&info=1&limit=8&k=${apiKey}`;
    
    const musicResponse = await axios.get(musicUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'StoryMap.ai/1.0',
        'Accept': 'application/json'
      }
    });

    console.log('TasteDive music response status:', musicResponse.status);
    console.log('TasteDive music data:', musicResponse.data);

    // Get movie recommendations  
    const movieUrl = `https://tastedive.com/api/similar?q=${encodeURIComponent(locationName + ' Australia')}&type=movies&info=1&limit=5&k=${apiKey}`;
    
    const movieResponse = await axios.get(movieUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'StoryMap.ai/1.0',
        'Accept': 'application/json'
      }
    });

    console.log('TasteDive movie response status:', movieResponse.status);
    console.log('TasteDive movie data:', movieResponse.data);

    const musicResults = musicResponse.data?.Similar?.Results || [];
    const movieResults = movieResponse.data?.Similar?.Results || [];

    console.log('Parsed results:', { musicCount: musicResults.length, movieCount: movieResults.length });

    // If we got results from API, use them
    if (musicResults.length > 0 || movieResults.length > 0) {
      return {
        musicItems: musicResults.map(item => ({
          name: item.Name,
          artist: item.Name,
          genre: item.Type || 'Music',
          description: item.wTeaser || `Musical artist recommended for ${locationName}`,
          url: item.wUrl || '#'
        })),
        movieItems: movieResults.map(item => ({
          name: item.Name,
          type: item.Type || 'Movie',
          description: item.wTeaser || `Film recommendation for ${locationName}`,
          url: item.wUrl || '#'
        })),
        bookItems: [] // TasteDive doesn't have books in free tier
      };
    } else {
      console.log('No results from TasteDive API, using fallback');
      return getFallbackRecommendations(location);
    }
  } catch (error) {
    console.error('TasteDive API error:', error.response?.data || error.message);
    console.log('Using fallback recommendations due to API error');
    return getFallbackRecommendations(location);
  }
};
