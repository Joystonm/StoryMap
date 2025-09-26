const tasteDiveService = require('../services/tasteDiveService');
const tavilyService = require('../services/tavilyService');
const musicBrainzService = require('../services/musicBrainzService');
const artService = require('../services/artService');

const getCulturalInsights = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    console.log('Fetching cultural insights for:', location);

    // Fetch data from multiple APIs concurrently
    const [musicData, artData, tavilyEvents, tavilyLandmarks, tavilyFood] = await Promise.allSettled([
      musicBrainzService.getMusicByLocation(location),
      artService.getArtByLocation(location),
      tavilyService.getCulturalEvents(location),
      tavilyService.getCulturalLandmarks(location),
      tavilyService.getFoodRecommendations(location)
    ]);

    // Extract successful results
    const music = musicData.status === 'fulfilled' ? musicData.value : null;
    const art = artData.status === 'fulfilled' ? artData.value : null;
    const events = tavilyEvents.status === 'fulfilled' ? tavilyEvents.value : null;
    const landmarks = tavilyLandmarks.status === 'fulfilled' ? tavilyLandmarks.value : null;
    const food = tavilyFood.status === 'fulfilled' ? tavilyFood.value : null;

    // Structure the response with real, validated data
    const insights = {
      music: {
        summary: music ? `Local music scene from ${location}` : `No local music results found for ${location} — explore nearby regions instead.`,
        items: music?.artists || []
      },
      art: {
        summary: art ? `Art and cultural venues in ${location}` : `No local art results found for ${location} — explore nearby regions instead.`,
        items: art?.items || []
      },
      food: {
        summary: food?.summary || `No local food results found for ${location} — explore nearby regions instead.`,
        items: food?.items || []
      },
      culture: {
        summary: landmarks?.summary || `Cultural heritage of ${location}`,
        items: [
          ...(events?.events || []).map(event => ({
            name: event.title || event.name,
            type: 'Event',
            description: event.description || 'Cultural event or festival',
            date: event.date,
            url: event.url
          })),
          ...(landmarks?.landmarks || []).map(landmark => ({
            name: landmark.title || landmark.name,
            type: 'Landmark',
            description: landmark.description || 'Cultural landmark or site',
            url: landmark.url
          }))
        ]
      }
    };

    // Add metadata about data sources and validation
    const metadata = {
      location: location,
      sources: {
        music: music ? 'Available' : 'No Results',
        art: art ? 'Available' : 'No Results',
        events: events ? 'Available' : 'Limited',
        landmarks: landmarks ? 'Available' : 'Limited',
        food: food ? 'Available' : 'Limited'
      },
      validation: {
        musicResults: music?.artists?.length || 0,
        artResults: art?.items?.length || 0,
        totalResults: (music?.artists?.length || 0) + (art?.items?.length || 0) + (events?.events?.length || 0)
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      insights,
      metadata
    });

  } catch (error) {
    console.error('Cultural insights error:', error.message);
    res.status(500).json({ error: 'Failed to fetch cultural insights' });
  }
};

module.exports = {
  getCulturalInsights
};
