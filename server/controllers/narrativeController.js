const groqService = require('../services/groqService');
const tavilyService = require('../services/tavilyService');

const generateStory = async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    console.log('Generating single story for:', location);

    const story = await groqService.generateNarrative(location, 'outback adventure');
    
    res.json({
      title: story.title || `Tale from ${location}`,
      content: story.content,
      location: location,
      theme: 'outback adventure',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Story generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate story' });
  }
};

const generateMultipleStories = async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    console.log('Generating factual stories for:', location);

    // Step 1: Fetch real data about the location using Tavily
    const [historicalData, culturalData, climateData] = await Promise.allSettled([
      tavilyService.getHistoricalData(location),
      tavilyService.getCulturalData(location),
      tavilyService.getClimateData(location)
    ]);

    // Extract successful results and validate content
    const historical = historicalData.status === 'fulfilled' && historicalData.value?.summary ? historicalData.value : null;
    const cultural = culturalData.status === 'fulfilled' && culturalData.value?.summary ? culturalData.value : null;
    const climate = climateData.status === 'fulfilled' && climateData.value?.summary ? climateData.value : null;

    // Step 2: Create factual story contexts based on real data
    const storyContexts = [];
    
    if (historical && historical.summary.length > 50) {
      storyContexts.push({
        theme: 'historical',
        title: 'Historical Background',
        context: `Historical facts about ${location}: ${historical.summary}. Sources: ${historical.sources?.map(s => s.title).join(', ') || 'Historical records'}`
      });
    }

    if (cultural && cultural.summary.length > 50) {
      storyContexts.push({
        theme: 'cultural',
        title: 'Cultural Heritage',
        context: `Cultural information about ${location}: ${cultural.summary}. Sources: ${cultural.sources?.map(s => s.title).join(', ') || 'Cultural records'}`
      });
    }

    if (climate && climate.summary && climate.summary.length > 50) {
      storyContexts.push({
        theme: 'environmental',
        title: 'Environmental Context',
        context: `Environmental and climate information about ${location}: ${climate.summary}`
      });
    }

    // Add general context if we have limited specific data
    if (storyContexts.length < 2) {
      storyContexts.push({
        theme: 'general',
        title: 'Regional Overview',
        context: `General verified information about ${location}, Australia, including its geographic location, administrative details, and regional characteristics. Focus on documented facts about the area's significance and role in the region.`
      });
    }

    // Step 3: Generate factual stories using real data
    const storyPromises = storyContexts.map(async (contextData, index) => {
      try {
        const story = await groqService.generateContextualNarrative(
          location, 
          contextData.theme, 
          contextData.context
        );
        
        // Validate story content
        if (!story.content || story.content.length < 100) {
          console.warn(`Story too short for ${contextData.theme}, skipping`);
          return null;
        }
        
        return {
          id: index + 1,
          title: story.title || contextData.title,
          content: story.content,
          theme: contextData.theme,
          location: location,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Failed to generate ${contextData.theme} story:`, error.message);
        return null;
      }
    });

    const stories = (await Promise.all(storyPromises)).filter(story => story !== null);

    if (stories.length === 0) {
      throw new Error('Failed to generate any factual stories with available data');
    }

    res.json({
      location: location,
      stories: stories,
      dataContext: {
        historical: historical ? 'Available' : 'Limited',
        cultural: cultural ? 'Available' : 'Limited',
        climate: climate ? 'Available' : 'Limited'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Factual stories generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate factual stories' });
  }
};

const generateCharacter = async (req, res) => {
  try {
    const { location, characterType = 'local resident' } = req.body;
    
    const character = await groqService.generateCharacter(location, characterType);
    
    res.json(character);
  } catch (error) {
    console.error('Character generation error:', error.message);
    res.status(500).json({ error: 'Failed to generate character' });
  }
};

module.exports = {
  generateStory,
  generateMultipleStories,
  generateCharacter
};
