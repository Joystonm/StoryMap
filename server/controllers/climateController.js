const climateEventsService = require('../services/climateEventsService');
const tavilyService = require('../services/tavilyService');

const getAllClimateEvents = async (req, res) => {
  try {
    const events = await climateEventsService.getAllClimateEvents();
    
    res.json({
      success: true,
      events: events,
      metadata: {
        totalEvents: events.length,
        eventTypes: {
          bushfires: events.filter(e => e.type === 'bushfires').length,
          floods: events.filter(e => e.type === 'floods').length,
          droughts: events.filter(e => e.type === 'droughts').length
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching all climate events:', error);
    res.status(500).json({ error: 'Failed to fetch climate events' });
  }
};

const getClimateEvents = async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const events = await tavilyService.getClimateEvents(location);
    
    res.json({
      success: true,
      events: events || [],
      location: location,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching climate events:', error);
    res.status(500).json({ error: 'Failed to fetch climate events' });
  }
};

module.exports = {
  getAllClimateEvents,
  getClimateEvents
};
