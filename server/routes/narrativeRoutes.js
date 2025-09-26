const express = require('express');
const { generateStory, generateMultipleStories, generateCharacter } = require('../controllers/narrativeController');

const router = express.Router();

router.post('/story', generateStory);
router.post('/stories', generateMultipleStories);
router.post('/character', generateCharacter);

module.exports = router;
