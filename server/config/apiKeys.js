module.exports = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: 'https://api.groq.com/openai/v1'
  },
  qloo: {
    apiKey: process.env.QLOO_API_KEY,
    baseUrl: 'https://api.qloo.com/v1'
  },
  tavily: {
    apiKey: process.env.TAVILY_API_KEY,
    baseUrl: 'https://api.tavily.com'
  },
  openStreetMap: {
    baseUrl: 'https://nominatim.openstreetmap.org'
  }
};
