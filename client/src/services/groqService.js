import axios from 'axios';

const makeGroqRequest = async (apiKey, messages, maxTokens = 600, temperature = 0.8) => {
  try {
    console.log('Making Groq request with API key:', apiKey ? 'Present' : 'Missing');
    
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.1-8b-instant',
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Reduced from 30000 to 10000
    });

    console.log('Groq response received:', response.status);
    return response.data;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    throw error;
  }
};

const getTavilyData = async (location, theme) => {
  const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const searchQueries = {
      'cultural heritage': `${location} Australia Indigenous culture history`,
      'pioneering spirit': `${location} Australia pioneers settlers farming`,
      'natural landscape': `${location} Australia landscape geography`,
      'community resilience': `${location} Australia community challenges recovery`
    };

    const query = searchQueries[theme] || `${location} Australia history`;
    
    // Faster timeout for quicker response
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: apiKey,
      query: query,
      search_depth: 'basic', // Use basic instead of advanced for speed
      include_answer: true,
      max_results: 3 // Reduce results for speed
    }, {
      timeout: 5000, // Reduced from 20000 to 5000
      headers: { 'Content-Type': 'application/json' }
    });
    
    const results = response.data?.results || [];
    const answer = response.data?.answer || '';
    
    if (results.length > 0 || answer) {
      const combinedData = [
        answer,
        ...results.slice(0, 2).map(r => r.content)
      ].filter(Boolean).join(' ').substring(0, 800); // Reduced from 1500
      
      return combinedData;
    }
  } catch (error) {
    console.log('Tavily timeout/error, using fallback');
  }
  
  return null;
};

export const generateNarrative = async (location, theme = 'cultural heritage') => {
  const groqApiKey = process.env.REACT_APP_GROQ_API_KEY;
  
  console.log('Environment check:', {
    groqKey: groqApiKey ? 'Present' : 'Missing',
    tavilyKey: process.env.REACT_APP_TAVILY_API_KEY ? 'Present' : 'Missing',
    location,
    theme
  });
  
  // Get Tavily data with timeout
  const tavilyDataPromise = getTavilyData(location, theme);
  
  if (!groqApiKey) {
    console.log('No Groq API key, using fallback');
    const tavilyData = await tavilyDataPromise;
    return {
      content: tavilyData || getFastFallbackStory(location, theme),
      title: `Tales from ${location}`,
      theme: theme,
      location: location,
      dataSource: tavilyData ? 'Tavily API' : 'Fallback'
    };
  }

  try {
    // Wait for Tavily data (with timeout)
    const tavilyData = await Promise.race([
      tavilyDataPromise,
      new Promise(resolve => setTimeout(() => resolve(null), 3000)) // 3 second timeout
    ]);
    
    let prompt;
    if (tavilyData) {
      prompt = `Based on this info about ${location}: "${tavilyData.substring(0, 500)}"

Write a 200-word story about ${location} focusing on ${theme}. Make it engaging and respectful.`;
    } else {
      prompt = `Write a 200-word story about ${location}, Australia, focusing on ${theme}. Include cultural heritage and community spirit.`;
    }
    
    const messages = [
      {
        role: 'system',
        content: 'You are a storyteller. Write engaging, respectful stories about Australian locations.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // Faster Groq call
    const data = await makeGroqRequest(groqApiKey, messages, 300, 0.7); // Reduced tokens and temperature
    const content = data.choices[0].message.content;

    return {
      content: content,
      title: `Stories from ${location}`,
      theme: theme,
      location: location,
      dataSource: tavilyData ? 'Tavily + Groq APIs' : 'Groq API'
    };
  } catch (error) {
    console.log('API error, using fallback:', error.message);
    return {
      content: getFastFallbackStory(location, theme),
      title: `Heritage of ${location}`,
      theme: theme,
      location: location,
      dataSource: 'Fast Fallback'
    };
  }
};

export const generateMultipleStories = async (location) => {
  const themes = ['cultural heritage', 'pioneering spirit', 'natural landscape', 'community resilience'];
  
  console.log('Generating multiple stories for:', location);
  
  // Generate all stories in parallel for speed
  const storyPromises = themes.map(async (theme, index) => {
    try {
      // Set shorter timeouts for faster response
      const story = await Promise.race([
        generateNarrative(location, theme),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 8000) // 8 second timeout
        )
      ]);
      
      return {
        id: index + 1,
        title: story.title,
        content: story.content,
        theme: theme,
        location: location,
        dataSource: story.dataSource
      };
    } catch (error) {
      console.log(`Fast fallback for story ${index + 1}:`, theme);
      return {
        id: index + 1,
        title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} of ${location}`,
        content: getFastFallbackStory(location, theme),
        theme: theme,
        location: location,
        dataSource: 'Fast Fallback'
      };
    }
  });
  
  // Wait for all stories to complete in parallel
  const stories = await Promise.all(storyPromises);
  console.log('All stories generated in parallel');
  
  return stories;
};

const getFastFallbackStory = (location, theme) => {
  const locationSpecific = {
    'canberra': {
      'cultural heritage': `Canberra, Australia's planned capital, represents a unique blend of Indigenous heritage and modern Australian identity. The Ngunnawal people have been custodians of this land for over 20,000 years, with their cultural sites still visible throughout the region. When Canberra was established in 1913, it became a symbol of Australian federation and democracy, housing Parliament House and national institutions that tell the story of our nation.`,
      'pioneering spirit': `Canberra's creation was itself an act of pioneering vision - building a capital city from scratch in the Australian bush. The city's founders, including Walter Burley Griffin, imagined a garden city that would embody Australian values. Today, Canberra continues this pioneering tradition through innovation in government, education, and technology, making it a hub for forward-thinking Australians.`,
      'natural landscape': `Nestled in the Australian Capital Territory, Canberra is surrounded by native bushland, rolling hills, and the iconic Lake Burley Griffin. The city's design incorporates the natural landscape, with native vegetation and wildlife corridors preserved throughout urban areas. From Mount Ainslie to the Brindabella Ranges, Canberra offers stunning vistas that change with the seasons.`,
      'community resilience': `Canberra's community has faced significant challenges, including the devastating 2003 bushfires that reached the city's suburbs. The response showed the strength of Canberrans - neighbors helping neighbors, emergency services working tirelessly, and the community rebuilding stronger. This resilience continues today as Canberra adapts to climate change and grows as a sustainable, liveable city.`
    }
  };

  const genericFallbacks = {
    'cultural heritage': `${location} stands as a testament to Australia's rich cultural tapestry. Here, ancient Aboriginal traditions blend with colonial history and modern multicultural influences. The land holds stories of traditional custodians who have maintained their connection to country for thousands of years, alongside tales of early settlers who built communities with determination and hope.`,
    'pioneering spirit': `The pioneering spirit of ${location} reflects the resilience and determination that built rural Australia. From early explorers and settlers to modern farmers and entrepreneurs, this region has been shaped by people willing to take on challenges and build something lasting. Their legacy lives on in the strong communities and thriving industries that define ${location} today.`,
    'natural landscape': `${location}'s natural landscape tells a story of ancient geology and diverse ecosystems. From rolling hills to vast plains, from native bushland to cultivated fields, the environment here has shaped both human settlement and wildlife habitats. This land continues to inspire visitors with its raw beauty and ecological significance.`,
    'community resilience': `The people of ${location} have shown remarkable resilience through droughts, floods, and other challenges that test rural Australian communities. Their ability to come together, support one another, and rebuild stronger demonstrates the enduring spirit that defines regional Australia. This resilience continues to be the foundation of community life.`
  };
  
  const locationKey = location.toLowerCase();
  return locationSpecific[locationKey]?.[theme] || genericFallbacks[theme] || `Discover the remarkable story of ${location}, where Australian heritage and community spirit create something truly special.`;
};
