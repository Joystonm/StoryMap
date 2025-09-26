const express = require('express');
const { searchLocations, getLocationDetails } = require('../controllers/locationController');

const router = express.Router();

router.get('/search', searchLocations);
router.get('/details/:lat/:lon', getLocationDetails);

module.exports = router;
