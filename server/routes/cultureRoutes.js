const express = require('express');
const { getCulturalInsights } = require('../controllers/cultureController');

const router = express.Router();

router.get('/insights', getCulturalInsights);

module.exports = router;
