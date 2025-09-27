import axios from 'axios';

const locationData = {
  'sydney': { lat: -33.8688, lng: 151.2093, description: 'Australia\'s largest city, known for its iconic Opera House and Harbour Bridge.' },
  'melbourne': { lat: -37.8136, lng: 144.9631, description: 'Cultural capital of Australia, famous for its coffee culture and street art.' },
  'brisbane': { lat: -27.4698, lng: 153.0251, description: 'Subtropical capital of Queensland, gateway to the Gold Coast.' },
  'perth': { lat: -31.9505, lng: 115.8605, description: 'Western Australia\'s capital, one of the most isolated major cities in the world.' },
  'adelaide': { lat: -34.9285, lng: 138.6007, description: 'City of churches, known for its festivals and wine regions.' },
  'darwin': { lat: -12.4634, lng: 130.8456, description: 'Tropical capital of the Northern Territory, gateway to Asia.' },
  'canberra': { lat: -35.2809, lng: 149.1300, description: 'Australia\'s planned capital city, home to national institutions.' },
  'hobart': { lat: -42.8821, lng: 147.3272, description: 'Tasmania\'s capital, known for MONA and its historic waterfront.' }
};

const findBestMatch = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (locationData[normalizedQuery]) {
    return { key: normalizedQuery, ...locationData[normalizedQuery] };
  }
  
  for (const [key, data] of Object.entries(locationData)) {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      return { key, ...data };
    }
  }
  
  return { key: 'sydney', ...locationData['sydney'] };
};

export const searchLocations = async (query) => {
  const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
  
  console.log('Tavily search API check:', {
    hasKey: !!apiKey,
    query,
    keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
  });
  
  const location = findBestMatch(query);
  
  if (apiKey) {
    try {
      console.log('Making Tavily API request for location search...');
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: apiKey,
        query: `${query} Australia location coordinates geography`,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Tavily search response status:', response.status);
      console.log('Tavily search data:', response.data);
      
      if (response.data?.results?.length > 0) {
        const result = response.data.results[0];
        console.log('Using Tavily search result');
        
        return {
          locations: [{
            id: 1,
            name: query,
            lat: location.lat,
            lng: location.lng,
            description: result.content?.substring(0, 200) + '...' || location.description,
            region: 'Australia',
            population: 'Settlement',
            established: 'Historic location'
          }]
        };
      }
    } catch (error) {
      console.error('Tavily search error:', error.response?.data || error.message);
    }
  }
  
  console.log('Using local location data for:', query);
  return {
    locations: [{
      id: 1,
      name: query,
      lat: location.lat,
      lng: location.lng,
      description: location.description,
      region: 'Australia',
      population: 'Major city',
      established: 'Historic settlement'
    }]
  };
};

export const getArtRecommendations = async (locationName) => {
  const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
  
  console.log('Tavily art API check:', { hasKey: !!apiKey, locationName });
  
  if (!apiKey) {
    return getFallbackArtData(locationName);
  }

  try {
    console.log('Making Tavily API request for art...');
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: `${locationName} Australia art galleries museums artists exhibitions contemporary aboriginal`,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    }, {
      timeout: 20000,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Tavily art response:', response.status, response.data);

    const results = response.data?.results || [];
    if (results.length > 0) {
      return results.slice(0, 4).map((result, index) => ({
        name: result.title || `Art Gallery ${index + 1}`,
        artist: 'Local Artists',
        medium: 'Various',
        description: result.content?.substring(0, 120) + '...' || 'Local art venue or exhibition',
        url: result.url || '#'
      }));
    }
  } catch (error) {
    console.error('Tavily art error:', error.message);
  }
  
  return getFallbackArtData(locationName);
};

export const getFoodRecommendations = async (locationName) => {
  const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
  
  console.log('Tavily food API check:', { hasKey: !!apiKey, locationName });
  
  if (!apiKey) {
    return getFallbackFoodData(locationName);
  }

  try {
    console.log('Making Tavily API request for food...');
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: `${locationName} Australia local food restaurants cuisine traditional dishes specialties`,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    }, {
      timeout: 20000,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Tavily food response:', response.status, response.data);

    const results = response.data?.results || [];
    if (results.length > 0) {
      return results.slice(0, 4).map((result, index) => ({
        name: result.title || `Local Dish ${index + 1}`,
        type: 'Local Cuisine',
        description: result.content?.substring(0, 120) + '...' || 'Local food specialty',
        url: result.url || '#'
      }));
    }
  } catch (error) {
    console.error('Tavily food error:', error.message);
  }
  
  return getFallbackFoodData(locationName);
};

export const getEventsRecommendations = async (locationName) => {
  const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
  
  console.log('Tavily events API check:', { hasKey: !!apiKey, locationName });
  
  if (!apiKey) {
    return getFallbackEventsData(locationName);
  }

  try {
    console.log('Making Tavily API request for events...');
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: `${locationName} Australia events festivals cultural celebrations community activities`,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    }, {
      timeout: 20000,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Tavily events response:', response.status, response.data);

    const results = response.data?.results || [];
    if (results.length > 0) {
      return results.slice(0, 4).map((result, index) => ({
        name: result.title || `Cultural Event ${index + 1}`,
        date: 'Various dates',
        description: result.content?.substring(0, 120) + '...' || 'Local cultural event or festival',
        url: result.url || '#'
      }));
    }
  } catch (error) {
    console.error('Tavily events error:', error.message);
  }
  
  return getFallbackEventsData(locationName);
};

const getFallbackArtData = (locationName) => [
  { name: `${locationName} Art Gallery`, artist: 'Local Artists', medium: 'Various', description: `Main art gallery in ${locationName}`, url: '#' },
  { name: 'Aboriginal Art Center', artist: 'Indigenous Artists', medium: 'Traditional', description: 'Traditional Aboriginal art and culture', url: '#' },
  { name: 'Contemporary Exhibitions', artist: 'Modern Artists', medium: 'Mixed Media', description: 'Contemporary art exhibitions', url: '#' }
];

const getFallbackFoodData = (locationName) => [
  { name: `${locationName} Specialties`, type: 'Regional', description: `Local food specialties of ${locationName}`, url: '#' },
  { name: 'Bush Tucker', type: 'Traditional', description: 'Native Australian ingredients and dishes', url: '#' },
  { name: 'Local Markets', type: 'Fresh Produce', description: 'Fresh local produce and artisan foods', url: '#' }
];

const getFallbackEventsData = (locationName) => [
  { name: `${locationName} Festival`, date: 'Annual', description: `Main cultural festival in ${locationName}`, url: '#' },
  { name: 'NAIDOC Week', date: 'July', description: 'Aboriginal and Torres Strait Islander culture celebration', url: 'https://www.naidoc.org.au' },
  { name: 'Community Markets', date: 'Weekly', description: 'Local community markets and events', url: '#' }
];

export const getLocationStory = async (locationId, locationName) => {
  const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
  
  console.log('Tavily story API check:', {
    hasKey: !!apiKey,
    locationName,
    keyPreview: apiKey ? apiKey.substring(0, 10) + '...' : 'None'
  });
  
  if (apiKey) {
    try {
      console.log('Making Tavily API request for location story...');
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: apiKey,
        query: `${locationName} Australia history culture Indigenous heritage story`,
        search_depth: 'advanced',
        include_answer: true,
        max_results: 5
      }, {
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Tavily story response status:', response.status);
      console.log('Tavily story data:', response.data);
      
      if (response.data?.answer || response.data?.results?.length > 0) {
        const content = response.data.answer || response.data.results[0]?.content || '';
        console.log('Using Tavily story content');
        
        return {
          story: {
            title: `Stories from ${locationName}`,
            content: content.substring(0, 500) + '...',
            culturalInsights: [
              'Historical significance from Tavily research',
              'Cultural traditions and practices',
              'Indigenous heritage connections',
              'Modern community development'
            ],
            recommendations: {
              music: ['Local folk traditions', 'Contemporary Australian artists'],
              art: ['Regional artistic expressions', 'Historical artifacts'],
              activities: ['Heritage walks', 'Cultural experiences', 'Community events']
            }
          }
        };
      }
    } catch (error) {
      console.error('Tavily story error:', error.response?.data || error.message);
    }
  }
  
  // Fallback story
  console.log('Using fallback story content');
  const fallbackStories = {
    'sydney': 'From the ancient Gadigal people to modern multicultural metropolis, Sydney\'s story spans millennia.',
    'melbourne': 'Built on Kulin Nation lands, Melbourne grew from a small settlement to Australia\'s cultural capital.',
    'brisbane': 'The Brisbane River winds through country that has been home to the Turrbal and Jagera peoples for thousands of years.'
  };
  
  const normalizedName = locationName.toLowerCase();
  const content = fallbackStories[normalizedName] || `Discover the rich heritage of ${locationName}, where ancient Aboriginal culture meets modern Australia.`;
  
  return {
    story: {
      title: `Stories from ${locationName}`,
      content: content,
      culturalInsights: [
        'Indigenous heritage and traditional custodians',
        'Colonial history and early settlement',
        'Modern multicultural community',
        'Connection to land and waterways'
      ],
      recommendations: {
        music: ['Traditional Aboriginal music', 'Contemporary Australian artists'],
        art: ['Indigenous art galleries', 'Local artist studios'],
        activities: ['Cultural walking tours', 'Heritage site visits']
      }
    }
  };
};
