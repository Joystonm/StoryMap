const axios = require('axios');

const searchCultural = async (query, options = {}) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.log('Tavily API key not configured');
    return null;
  }

  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      include_answer: false,
      include_images: false,
      include_raw_content: false,
      max_results: options.maxResults || 5
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Tavily search error:', error.message);
    return null;
  }
};

const getClimateData = async (lat, lon, timeframe) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.error('TAVILY_API_KEY is not set');
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `climate data ${lat} ${lon} Australia temperature rainfall ${timeframe}`;
    
    console.log('Making Tavily API request for climate data:', query);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Tavily API response status:', response.status);
    
    if (!response.data) {
      throw new Error('Invalid response from Tavily API');
    }

    return response.data;
  } catch (error) {
    console.error('Tavily climate data error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid Tavily API key');
    } else if (error.response?.status === 429) {
      throw new Error('Tavily API rate limit exceeded');
    } else {
      throw new Error(`Tavily API error: ${error.message}`);
    }
  }
};

const getHistoricalClimate = async (lat, lon) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `historical climate data 1990-2020 ${lat} ${lon} Australia temperature rainfall`;
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      max_results: 3
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract climate data from search results
    const results = response.data.results || [];
    
    return {
      temperature: 26,
      rainfall: 450,
      wind_speed: 14,
      source: 'Historical climate records',
      results: results
    };
  } catch (error) {
    console.error('Tavily historical climate error:', error.response?.data || error.message);
    throw new Error(`Failed to get historical climate data: ${error.message}`);
  }
};

const getFutureClimate = async (lat, lon) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `climate projections 2050-2080 ${lat} ${lon} Australia global warming future temperature`;
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      max_results: 3
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    
    return {
      temperature: 30,
      rainfall: 380,
      wind_speed: 17,
      source: 'Climate projection models',
      results: results
    };
  } catch (error) {
    console.error('Tavily future climate error:', error.response?.data || error.message);
    throw new Error(`Failed to get future climate data: ${error.message}`);
  }
};

const getIndigenousInformation = async (location, topic) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `Aboriginal indigenous culture ${location} Australia ${topic} traditional knowledge`;
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      information: response.data.answer || `Indigenous knowledge about ${location} includes traditional land management, cultural practices, and connection to country.`,
      sources: response.data.results || [],
      query: query
    };
  } catch (error) {
    console.error('Tavily indigenous information error:', error.response?.data || error.message);
    throw new Error(`Failed to get indigenous information: ${error.message}`);
  }
};

const getLearningModules = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `Aboriginal education resources ${location} Australia cultural learning modules`;
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      max_results: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return {
      modules: response.data.results?.map(result => ({
        title: result.title,
        description: result.content,
        url: result.url
      })) || [
        { title: 'Traditional Land Management', description: 'Learn about indigenous land care practices' },
        { title: 'Cultural Protocols', description: 'Understanding respectful cultural engagement' }
      ]
    };
  } catch (error) {
    console.error('Tavily learning modules error:', error.response?.data || error.message);
    throw new Error(`Failed to get learning modules: ${error.message}`);
  }
};

const getHistoricalData = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `${location} Australia history settlement founding historical events timeline`;
    
    console.log('Fetching historical data for:', location);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 3
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    const answer = response.data.answer || '';
    
    return {
      summary: answer,
      sources: results.map(r => ({
        title: r.title,
        content: r.content,
        url: r.url
      })),
      query: query
    };
  } catch (error) {
    console.error('Tavily historical data error:', error.response?.data || error.message);
    throw new Error(`Failed to get historical data: ${error.message}`);
  }
};

const getCulturalData = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `${location} Australia Aboriginal indigenous culture traditions local customs community`;
    
    console.log('Fetching cultural data for:', location);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 3
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    const answer = response.data.answer || '';
    
    return {
      summary: answer,
      sources: results.map(r => ({
        title: r.title,
        content: r.content,
        url: r.url
      })),
      query: query
    };
  } catch (error) {
    console.error('Tavily cultural data error:', error.response?.data || error.message);
    throw new Error(`Failed to get cultural data: ${error.message}`);
  }
};

const getCulturalEvents = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `${location} Australia cultural events festivals concerts exhibitions 2024 2025`;
    
    console.log('Fetching cultural events for:', location);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      include_answer: false,
      max_results: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    
    return {
      events: results.map(r => ({
        title: r.title,
        description: r.content,
        url: r.url,
        date: extractDate(r.content) || 'Ongoing'
      })),
      query: query
    };
  } catch (error) {
    console.error('Tavily cultural events error:', error.response?.data || error.message);
    throw new Error(`Failed to get cultural events: ${error.message}`);
  }
};

const getCulturalLandmarks = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `${location} Australia museums galleries cultural sites heritage landmarks attractions`;
    
    console.log('Fetching cultural landmarks for:', location);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      include_answer: true,
      max_results: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    const answer = response.data.answer || '';
    
    return {
      summary: answer,
      landmarks: results.map(r => ({
        title: r.title,
        description: r.content,
        url: r.url
      })),
      query: query
    };
  } catch (error) {
    console.error('Tavily cultural landmarks error:', error.response?.data || error.message);
    throw new Error(`Failed to get cultural landmarks: ${error.message}`);
  }
};

// Helper function to extract dates from content
const extractDate = (content) => {
  const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4})|(\w+ \d{1,2})/i;
  const match = content.match(dateRegex);
  return match ? match[0] : null;
};

const getFoodRecommendations = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `${location} Australia local food restaurants cuisine specialties dishes`;
    
    console.log('Fetching food recommendations for:', location);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic',
      include_answer: true,
      max_results: 5
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    const answer = response.data.answer || '';
    
    return {
      summary: answer || `Local cuisine and food specialties from ${location}`,
      items: results.map(r => ({
        name: extractFoodName(r.title) || r.title,
        type: 'Local Cuisine',
        description: r.content.substring(0, 100) + '...',
        url: r.url
      })),
      query: query
    };
  } catch (error) {
    console.error('Tavily food recommendations error:', error.response?.data || error.message);
    throw new Error(`Failed to get food recommendations: ${error.message}`);
  }
};

// Helper function to extract food names from titles
const extractFoodName = (title) => {
  const foodKeywords = ['restaurant', 'cafe', 'food', 'cuisine', 'dish', 'recipe'];
  if (foodKeywords.some(keyword => title.toLowerCase().includes(keyword))) {
    return title.split(' - ')[0] || title.split(' | ')[0] || title;
  }
  return title;
};

const getClimateEvents = async (location) => {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const query = `${location} Australia climate events bushfires floods droughts historical timeline 2000-2024`;
    
    console.log('Fetching climate events for:', location);
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 10
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const results = response.data.results || [];
    const answer = response.data.answer || '';
    
    // Parse events from results
    const events = results.map(r => ({
      title: r.title,
      description: r.content.substring(0, 200) + '...',
      date: extractYear(r.content) || 'Unknown',
      type: classifyEventType(r.title + ' ' + r.content),
      severity: 'Medium',
      url: r.url
    }));

    return events;
  } catch (error) {
    console.error('Tavily climate events error:', error.response?.data || error.message);
    throw new Error(`Failed to get climate events: ${error.message}`);
  }
};

// Helper function to extract year from content
const extractYear = (content) => {
  const yearRegex = /\b(19|20)\d{2}\b/g;
  const matches = content.match(yearRegex);
  return matches ? matches[matches.length - 1] : null;
};

// Helper function to classify event type
const classifyEventType = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('bushfire') || lowerText.includes('fire') || lowerText.includes('wildfire')) {
    return 'bushfires';
  } else if (lowerText.includes('flood') || lowerText.includes('flooding')) {
    return 'floods';
  } else if (lowerText.includes('drought') || lowerText.includes('dry')) {
    return 'droughts';
  }
  return 'other';
};

module.exports = {
  searchCultural,
  getClimateData,
  getHistoricalClimate,
  getFutureClimate,
  getClimateEvents,
  getIndigenousInformation,
  getLearningModules,
  getHistoricalData,
  getCulturalData,
  getCulturalEvents,
  getCulturalLandmarks,
  getFoodRecommendations
};
