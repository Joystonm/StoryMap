require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const locationRoutes = require('./routes/locationRoutes');
const narrativeRoutes = require('./routes/narrativeRoutes');
const cultureRoutes = require('./routes/cultureRoutes');
const climateRoutes = require('./routes/climateRoutes');
const indigenousRoutes = require('./routes/indigenousRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Log environment variables (without exposing keys)
console.log('Environment check:');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Missing');
console.log('TASTEDIVE_API_KEY:', process.env.TASTEDIVE_API_KEY ? 'Set' : 'Missing');
console.log('TAVILY_API_KEY:', process.env.TAVILY_API_KEY ? 'Set' : 'Missing');

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/location', locationRoutes);
app.use('/api/narrative', narrativeRoutes);
app.use('/api/culture', cultureRoutes);
app.use('/api/climate', climateRoutes);
app.use('/api/indigenous', indigenousRoutes);
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test API endpoints
app.get('/api/test/groq', async (req, res) => {
  try {
    const groqService = require('./services/groqService');
    const result = await groqService.generateNarrative('Sydney', 'test');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/test/tavily', async (req, res) => {
  try {
    const tavilyService = require('./services/tavilyService');
    const result = await tavilyService.getClimateData(-33.8688, 151.2093, 'current');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/test/tastedive', async (req, res) => {
  try {
    const tasteDiveService = require('./services/tasteDiveService');
    const result = await tasteDiveService.getCulturalRecommendations('Sydney');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
