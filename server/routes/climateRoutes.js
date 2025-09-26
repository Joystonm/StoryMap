const express = require('express');
const router = express.Router();
const climateController = require('../controllers/climateController');

// Get all climate events for map display
router.get('/events/all', climateController.getAllClimateEvents);

// Get climate events for specific location
router.get('/events', climateController.getClimateEvents);

module.exports = router;
