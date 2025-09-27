import { searchLocations, getLocationStory } from '../services/tavilyService';
import { getCulturalRecommendations } from '../services/tasteDiveService';
import { generateNarrative } from '../services/groqService';

// Helper functions for climate data
const extractLocation = (text) => {
  if (!text) return null;
  const locations = ['NSW', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Northern Territory'];
  for (const loc of locations) {
    if (text.includes(loc)) return loc;
  }
  return null;
};

const extractYear = (text) => {
  if (!text) return null;
  const yearMatch = text.match(/20(19|20|21|22|23|24)/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
};

const getRandomAustralianCoords = () => {
  const coords = [
    [-33.8688, 151.2093], // Sydney
    [-37.8136, 144.9631], // Melbourne  
    [-27.4698, 153.0251], // Brisbane
    [-31.9505, 115.8605], // Perth
    [-34.9285, 138.6007], // Adelaide
    [-42.8821, 147.3272], // Hobart
    [-12.4634, 130.8456]  // Darwin
  ];
  return coords[Math.floor(Math.random() * coords.length)];
};

// Direct service calls - no backend needed
const apiClient = {
  get: async (url) => {
    console.log(`Direct service call GET: ${url}`);
    
    try {
      // Parse URL and extract parameters
      const urlParts = url.split('?');
      const path = urlParts[0];
      const params = new URLSearchParams(urlParts[1] || '');
      
      if (path.includes('/location/search')) {
        const query = params.get('query') || 'Sydney';
        const data = await searchLocations(query);
        
        // Transform data to match expected format
        const transformedData = data.locations.map(location => ({
          display_name: location.name,
          name: location.name,
          lat: location.lat.toString(),
          lon: location.lng.toString(),
          address: {
            state: location.region,
            country: 'Australia'
          }
        }));
        
        return { data: transformedData };
      }
      
      // Culture Explorer endpoint
      if (path.includes('/culture/insights')) {
        const location = params.get('location') || 'Australia';
        console.log('Fetching cultural insights for:', location);
        
        try {
          // Get music from TasteDive API
          console.log('Fetching music from TasteDive...');
          const musicData = await getCulturalRecommendations(location);
          
          // Get art, food, and events from Tavily API
          console.log('Fetching art, food, events from Tavily...');
          const { getArtRecommendations, getFoodRecommendations, getEventsRecommendations } = await import('../services/tavilyService');
          
          const [artData, foodData, eventsData] = await Promise.all([
            getArtRecommendations(location),
            getFoodRecommendations(location),
            getEventsRecommendations(location)
          ]);
          
          console.log('API Results:', {
            music: musicData.musicItems?.length || 0,
            art: artData?.length || 0,
            food: foodData?.length || 0,
            events: eventsData?.length || 0
          });
          
          return {
            data: {
              insights: {
                location: location,
                music: {
                  title: `Music from ${location}`,
                  summary: `Music recommendations for ${location} powered by TasteDive API`,
                  items: musicData.musicItems || []
                },
                art: {
                  title: `Art from ${location}`,
                  summary: `Art galleries and exhibitions in ${location} via Tavily API`,
                  items: artData || []
                },
                food: {
                  title: `Local Cuisine from ${location}`,
                  summary: `Food and dining in ${location} discovered through Tavily API`,
                  items: foodData || []
                },
                events: eventsData || []
              },
              metadata: {
                location: location,
                dataSource: 'TasteDive API (Music) & Tavily API (Art, Food, Events)',
                lastUpdated: new Date().toISOString(),
                totalItems: (musicData.musicItems?.length || 0) + (artData?.length || 0) + (foodData?.length || 0) + (eventsData?.length || 0),
                status: 'Available',
                apiStatus: {
                  tastedive: musicData.musicItems?.length > 0 ? 'Active' : 'Fallback',
                  tavily: (artData?.length > 0 || foodData?.length > 0 || eventsData?.length > 0) ? 'Active' : 'Fallback'
                }
              }
            }
          };
        } catch (error) {
          console.error('Error fetching cultural insights:', error);
          
          // Return fallback data with location-specific content
          return {
            data: {
              insights: {
                location: location,
                music: {
                  title: `Music from ${location}`,
                  summary: `Discover the music scene of ${location}`,
                  items: [
                    { name: 'Local Artists', artist: `${location} Musicians`, genre: 'Various', description: `Musical talent from ${location}`, url: '#' }
                  ]
                },
                art: {
                  title: `Art from ${location}`,
                  summary: `Artistic expressions from ${location}`,
                  items: [
                    { name: 'Local Galleries', artist: `${location} Artists`, medium: 'Various', description: `Art galleries in ${location}`, url: '#' }
                  ]
                },
                food: {
                  title: `Local Cuisine from ${location}`,
                  summary: `Taste the flavors of ${location}`,
                  items: [
                    { name: 'Local Specialties', type: 'Regional', description: `Signature dishes of ${location}`, url: '#' }
                  ]
                },
                events: [
                  { name: `${location} Cultural Festival`, date: 'Annual', description: `Main cultural celebration in ${location}`, url: '#' }
                ]
              },
              metadata: {
                location: location,
                dataSource: 'Fallback Data',
                lastUpdated: new Date().toISOString(),
                totalItems: 4,
                status: 'Available'
              }
            }
          };
        }
      }
      
      // Climate endpoints
      if (path.includes('/climate/events/all')) {
        console.log('Fetching all climate events...');
        
        try {
          // Try to get real climate data from Tavily
          const apiKey = process.env.REACT_APP_TAVILY_API_KEY;
          
          if (apiKey) {
            const { default: axios } = await import('axios');
            const response = await axios.post('https://api.tavily.com/search', {
              api_key: apiKey,
              query: 'Australia climate events bushfires floods droughts 2020 2021 2022 2023',
              search_depth: 'basic',
              include_answer: true,
              max_results: 5
            }, {
              timeout: 8000,
              headers: { 'Content-Type': 'application/json' }
            });

            console.log('Tavily climate data response:', response.status);
            
            const results = response.data?.results || [];
            if (results.length > 0) {
              const climateEvents = results.slice(0, 6).map((result, index) => ({
                id: index + 1,
                type: result.title?.toLowerCase().includes('fire') ? 'Bushfire' : 
                      result.title?.toLowerCase().includes('flood') ? 'Flood' : 'Drought',
                location: extractLocation(result.title) || 'Australia',
                year: extractYear(result.content) || 2023,
                severity: 'High',
                description: result.content?.substring(0, 100) + '...' || 'Climate event',
                impact: 'Community and environmental impact',
                coordinates: getRandomAustralianCoords()
              }));
              
              console.log('Using real Tavily climate data:', climateEvents.length, 'events');
              return { data: { events: climateEvents } };
            }
          }
        } catch (error) {
          console.log('Tavily climate data failed, using fallback');
        }
        
        // Fallback climate data with real events
        return {
          data: {
            events: [
              // Real Bushfire Events
              {
                id: 1,
                type: 'Bushfire',
                location: 'Black Summer - NSW',
                year: 2020,
                severity: 'Extreme',
                description: 'Black Summer bushfires devastated NSW communities',
                impact: 'Property damage, wildlife losses, air quality issues',
                coordinates: [-33.4569, 150.7944]
              },
              {
                id: 2,
                type: 'Bushfire',
                location: 'East Gippsland - VIC',
                year: 2020,
                severity: 'Extreme',
                description: 'East Gippsland fires destroyed thousands of hectares',
                impact: 'Evacuations, property damage, ecological destruction',
                coordinates: [-37.5622, 148.1847]
              },
              {
                id: 3,
                type: 'Bushfire',
                location: 'Perth Hills - WA',
                year: 2021,
                severity: 'High',
                description: 'Perth Hills bushfire threatened communities',
                impact: 'Home evacuations, property damage',
                coordinates: [-31.9505, 116.0765]
              },
              {
                id: 4,
                type: 'Bushfire',
                location: 'Adelaide Hills - SA',
                year: 2019,
                severity: 'High',
                description: 'Cudlee Creek fire in Adelaide Hills',
                impact: 'Property losses, livestock deaths',
                coordinates: [-34.9285, 138.8007]
              },
              
              // Real Flood Events
              {
                id: 5,
                type: 'Flood',
                location: 'Lismore - NSW',
                year: 2022,
                severity: 'Extreme',
                description: 'Record-breaking floods devastated Lismore',
                impact: 'Evacuations, infrastructure damage, economic losses',
                coordinates: [-28.8142, 153.2781]
              },
              {
                id: 6,
                type: 'Flood',
                location: 'Brisbane - QLD',
                year: 2022,
                severity: 'Major',
                description: 'Brisbane River flooding affected thousands',
                impact: 'Property damage, transport disruption',
                coordinates: [-27.4698, 153.0251]
              },
              {
                id: 7,
                type: 'Flood',
                location: 'Townsville - QLD',
                year: 2019,
                severity: 'Major',
                description: 'Monsoon flooding inundated Townsville',
                impact: 'Evacuations, infrastructure damage',
                coordinates: [-19.2590, 146.8169]
              },
              {
                id: 8,
                type: 'Flood',
                location: 'Katherine - NT',
                year: 2023,
                severity: 'Major',
                description: 'Katherine River flooding',
                impact: 'Community isolation, road closures',
                coordinates: [-14.4669, 132.2647]
              },
              
              // Real Drought Events
              {
                id: 9,
                type: 'Drought',
                location: 'Murray-Darling Basin',
                year: 2019,
                severity: 'Extreme',
                description: 'Severe drought across Murray-Darling Basin',
                impact: 'Agricultural losses, water restrictions',
                coordinates: [-34.0522, 142.0251]
              },
              {
                id: 10,
                type: 'Drought',
                location: 'Central Queensland',
                year: 2019,
                severity: 'Extreme',
                description: 'Extended drought conditions in Central QLD',
                impact: 'Livestock losses, crop failures',
                coordinates: [-23.3382, 150.5150]
              },
              {
                id: 11,
                type: 'Drought',
                location: 'Wheatbelt - WA',
                year: 2020,
                severity: 'High',
                description: 'Drought affected Western Australian Wheatbelt',
                impact: 'Reduced crop yields, water shortages',
                coordinates: [-31.0000, 117.8833]
              },
              {
                id: 12,
                type: 'Drought',
                location: 'Riverina - NSW',
                year: 2018,
                severity: 'Extreme',
                description: 'Millennium Drought conditions in Riverina',
                impact: 'Agricultural devastation, town water shortages',
                coordinates: [-34.7204, 146.9234]
              }
            ]
          }
        };
      }
      
      if (path.includes('/weather')) {
        const lat = params.get('lat') || '-25.2744';
        const lon = params.get('lon') || '133.7751';
        
        return {
          data: {
            temperature: Math.round(15 + Math.random() * 20),
            condition: ['sunny', 'partly cloudy', 'overcast'][Math.floor(Math.random() * 3)],
            humidity: Math.round(40 + Math.random() * 40),
            windSpeed: Math.round(5 + Math.random() * 15),
            coordinates: [parseFloat(lat), parseFloat(lon)]
          }
        };
      }
      
      if (path.includes('/climate/events')) {
        const location = params.get('location') || 'Australia';
        
        return {
          data: {
            events: [
              {
                id: 1,
                type: 'Drought',
                year: 2019,
                description: `Severe drought conditions affected ${location} and surrounding regions`,
                impact: 'High',
                recovery: 'Community resilience and government support programs',
                severity: 'Extreme'
              },
              {
                id: 2,
                type: 'Bushfire',
                year: 2020,
                description: `Bushfire season brought challenges to ${location} area`,
                impact: 'Medium',
                recovery: 'Local firefighting efforts and community support',
                severity: 'High'
              },
              {
                id: 3,
                type: 'Flood',
                year: 2022,
                description: `Flooding events in ${location} region`,
                impact: 'Medium',
                recovery: 'Infrastructure rebuilding and community support',
                severity: 'Major'
              }
            ],
            projections: {
              temperature: '+2.5°C by 2050',
              rainfall: '-15% by 2050',
              extremeEvents: 'Increased frequency'
            }
          }
        };
      }
      
      if (path.includes('/cultural/recommendations')) {
        const location = params.get('location') || 'Australia';
        const data = await getCulturalRecommendations(location);
        return { data };
      }
      
      if (path.includes('/indigenous/quiz')) {
        const location = params.get('location') || 'Australia';
        return {
          data: {
            questions: [
              {
                question: `What is the traditional Aboriginal name for the ${location} region?`,
                options: ['Gadigal', 'Wurundjeri', 'Turrbal', 'Noongar'],
                correctAnswer: 0,
                explanation: 'Different Aboriginal groups have traditional names for their country.'
              },
              {
                question: 'What is a didgeridoo traditionally made from?',
                options: ['Bamboo', 'Eucalyptus wood', 'Metal', 'Plastic'],
                correctAnswer: 1,
                explanation: 'Didgeridoos are traditionally made from eucalyptus branches hollowed out by termites.'
              }
            ]
          }
        };
      }
      
      // Fallback response
      return { data: [] };
    } catch (error) {
      console.error('GET Service Error:', error.message);
      return { data: [] };
    }
  },

  post: async (url, data) => {
    console.log(`Direct service call POST: ${url}`, data);
    
    try {
      if (url.includes('/narrative/story')) {
        const location = data.location || 'Australia';
        const theme = data.theme || 'cultural heritage';
        
        const story = await generateNarrative(location, theme);
        
        return {
          data: {
            title: story.title,
            content: story.content,
            theme: story.theme,
            location: story.location,
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
      }
      
      if (url.includes('/narrative/stories')) {
        const location = data.location || 'Australia';
        
        console.log('Generating multiple stories with real data for:', location);
        
        // Import and use the new multiple stories function
        const { generateMultipleStories } = await import('../services/groqService');
        const stories = await generateMultipleStories(location);
        
        console.log('Generated stories:', stories.length, 'stories with data sources:', stories.map(s => s.dataSource));
        
        return {
          data: {
            stories: stories,
            dataContext: {
              location: location,
              totalStories: stories.length,
              themes: stories.map(s => s.theme),
              dataSources: stories.map(s => s.dataSource),
              apiUsage: {
                tavily: stories.some(s => s.dataSource?.includes('Tavily')),
                groq: stories.some(s => s.dataSource?.includes('Groq'))
              }
            }
          }
        };
      }
      
      if (url.includes('/cultural/explore')) {
        const location = data.location || 'Australia';
        const recommendations = await getCulturalRecommendations(location);
        
        return {
          data: {
            location: location,
            music: recommendations.musicItems || [],
            art: recommendations.movieItems || [],
            activities: [
              { name: 'Aboriginal Art Gallery Tour', description: 'Explore traditional and contemporary Indigenous art' },
              { name: 'Bush Tucker Walk', description: 'Learn about native plants and traditional foods' },
              { name: 'Storytelling Circle', description: 'Listen to local Dreamtime stories' }
            ],
            festivals: [
              { name: 'NAIDOC Week Celebrations', date: 'July', description: 'Celebrate Aboriginal and Torres Strait Islander culture' },
              { name: 'Local Agricultural Show', date: 'Spring', description: 'Community celebration of rural life' }
            ]
          }
        };
      }
      
      // Fallback for other POST requests
      return {
        data: {
          message: 'Success',
          location: data.location || 'Australia'
        }
      };
    } catch (error) {
      console.error('POST Service Error:', error.message);
      throw error;
    }
  }
};

export default apiClient;
