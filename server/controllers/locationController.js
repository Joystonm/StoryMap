const axios = require('axios');
const { openStreetMap } = require('../config/apiKeys');

const searchLocations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const response = await axios.get(`${openStreetMap.baseUrl}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 5,
        countrycodes: 'au', // Focus on Australia
        addressdetails: 1
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Location search error:', error.message);
    res.status(500).json({ error: 'Failed to search locations' });
  }
};

const getLocationDetails = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    const response = await axios.get(`${openStreetMap.baseUrl}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Location details error:', error.message);
    res.status(500).json({ error: 'Failed to get location details' });
  }
};

module.exports = {
  searchLocations,
  getLocationDetails
};
