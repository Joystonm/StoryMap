const axios = require('axios');

// Available models in order of preference
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it'
];

const getAvailableModels = async (apiKey) => {
  try {
    const response = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const availableModels = response.data.data?.map(model => model.id) || [];
    console.log('Available Groq models:', availableModels);
    return availableModels;
  } catch (error) {
    console.error('Failed to fetch available models:', error.message);
    return GROQ_MODELS; // Fallback to hardcoded list
  }
};

const findWorkingModel = async (apiKey) => {
  const availableModels = await getAvailableModels(apiKey);
  
  // Find first model from our preference list that's available
  for (const model of GROQ_MODELS) {
    if (availableModels.includes(model)) {
      console.log('Using Groq model:', model);
      return model;
    }
  }
  
  // If none of our preferred models are available, use the first available one
  if (availableModels.length > 0) {
    console.log('Using fallback model:', availableModels[0]);
    return availableModels[0];
  }
  
  throw new Error('No available Groq models found');
};

const makeGroqRequest = async (apiKey, messages, maxTokens = 600, temperature = 0.8) => {
  const model = await findWorkingModel(apiKey);
  
  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      top_p: 0.9
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Groq API success with model ${model}:`, response.status);
    return response.data;
  } catch (error) {
    console.error('Groq API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Request Model:', model);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid Groq API key - check your credentials');
    } else if (error.response?.status === 429) {
      throw new Error('Groq API rate limit exceeded - try again later');
    } else if (error.response?.status === 400 && error.response?.data?.error?.code === 'model_decommissioned') {
      throw new Error(`Model ${model} is decommissioned - please update the service`);
    } else {
      throw new Error(`Groq API error (${error.response?.status}): ${error.response?.data?.error?.message || error.message}`);
    }
  }
};

const generateNarrative = async (location, theme) => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.error('GROQ_API_KEY is not set');
    throw new Error('Groq API key is not configured');
  }

  try {
    const prompt = `Create an engaging, culturally respectful short story set in ${location}, Australia. 
    Theme: ${theme}
    
    Requirements:
    - 200-300 words maximum
    - Focus on the unique landscape, culture, and atmosphere of rural Australia
    - Include authentic details about the region's history, industry, or natural features
    - Respectful portrayal of Indigenous culture if relevant
    - Emotional connection to the land and community
    - Vivid, sensory descriptions that transport the reader
    
    Style: Warm, human storytelling that captures the spirit of the Australian outback.`;
    
    console.log('Generating narrative for location:', location);
    
    const messages = [
      {
        role: 'system',
        content: 'You are a master storyteller specializing in Australian outback narratives. Your stories celebrate the resilience, culture, and natural beauty of rural Australia while being respectful of Indigenous heritage and local communities.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const data = await makeGroqRequest(apiKey, messages, 600, 0.8);
    
    if (!data || !data.choices || !data.choices[0]) {
      throw new Error('Invalid response format from Groq API');
    }

    const content = data.choices[0].message.content;
    
    // Extract title if present, otherwise generate one
    const titleMatch = content.match(/^(.+?)(?:\n|\.)/);
    const title = titleMatch ? titleMatch[1].replace(/['"]/g, '') : `Tales from ${location}`;

    return {
      content: content,
      title: title.length > 50 ? `Stories from ${location}` : title,
      theme: theme,
      location: location
    };
  } catch (error) {
    console.error('Story generation failed:', error.message);
    throw error;
  }
};

const generateCharacter = async (location, characterType) => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key is not configured');
  }

  try {
    const prompt = `Create a detailed, authentic character profile for a ${characterType} from ${location}, Australia.
    
    Include:
    - Name and age
    - Background and family history
    - Connection to the land and community
    - Daily life and challenges
    - Dreams and aspirations
    - Unique personality traits
    - How the landscape has shaped them
    
    Make them feel real and relatable, with depth and authenticity.`;
    
    const messages = [
      {
        role: 'system',
        content: 'You create authentic, respectful character profiles of rural Australians. Your characters are diverse, realistic, and reflect the true spirit of outback communities.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const data = await makeGroqRequest(apiKey, messages, 400, 0.7);

    return {
      character: data.choices[0].message.content,
      location: location,
      type: characterType
    };
  } catch (error) {
    console.error('Character generation failed:', error.message);
    throw error;
  }
};

const generateContextualNarrative = async (location, theme, context) => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key is not configured');
  }

  try {
    const prompt = `Based on the following verified information about ${location}, Australia, create a factual, concise narrative:

    ${context}
    
    Requirements:
    - Use ONLY the provided factual information
    - Write 2-3 paragraphs (150-200 words maximum)
    - Focus on real historical events, verified cultural practices, or documented facts
    - Avoid fictional characters or imagined scenarios
    - Present information in an engaging but factual storytelling format
    - If insufficient factual data is provided, focus on general verified information about the region
    
    Create a compelling title and factual narrative based on this real information.`;
    
    console.log(`Generating factual ${theme} narrative for:`, location);
    
    const messages = [
      {
        role: 'system',
        content: 'You are a factual storyteller who creates engaging narratives based strictly on verified information. You never fabricate details, characters, or events. You present real facts in a compelling narrative format.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const data = await makeGroqRequest(apiKey, messages, 300, 0.3);
    
    if (!data || !data.choices || !data.choices[0]) {
      throw new Error('Invalid response format from Groq API');
    }

    const response = data.choices[0].message.content;
    
    // Validate that response contains substantial content
    if (!response || response.length < 50) {
      throw new Error('Generated content too short or empty');
    }

    // Extract title from first line or create one
    const lines = response.split('\n').filter(line => line.trim());
    const title = lines[0].length < 80 ? lines[0].replace(/^(Title:|Story:)/i, '').trim() : `Facts about ${location}`;
    const content = lines.slice(1).join('\n').trim() || response;

    return {
      title: title,
      content: content,
      theme: theme,
      location: location
    };
  } catch (error) {
    console.error(`Factual narrative generation failed for ${theme}:`, error.message);
    throw error;
  }
};

const generateIndigenousQuiz = async (location, culturalData) => {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('Groq API key is not configured');
  }

  try {
    const prompt = `Based on the following verified cultural and historical information about ${location}, Australia, create 8 educational quiz questions about Indigenous culture:

    Cultural Information:
    ${culturalData.information || 'General Indigenous Australian culture'}
    
    Sources: ${culturalData.sources?.map(s => s.title).join(', ') || 'Various cultural sources'}
    
    Requirements:
    - Create exactly 8 multiple-choice questions (A, B, C, D format)
    - Base questions ONLY on the provided factual information
    - Focus on publicly available cultural knowledge (tools, art, practices, history)
    - Avoid sacred or sensitive cultural content
    - Include one correct answer and 3 plausible distractors
    - Provide brief explanations for correct answers
    - Questions should be respectful and educational
    
    Return as JSON array with this exact format:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation of the correct answer"
      }
    ]`;
    
    const messages = [
      {
        role: 'system',
        content: 'You are an educational content creator specializing in respectful Indigenous Australian cultural education. You create factual quiz questions based only on provided verified information, avoiding sacred or sensitive content.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const data = await makeGroqRequest(apiKey, messages, 1200, 0.2);
    
    if (!data || !data.choices || !data.choices[0]) {
      throw new Error('Invalid response from Groq API');
    }

    let content = data.choices[0].message.content.trim();
    
    // Clean up the response to extract JSON
    if (content.includes('```json')) {
      content = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      content = content.split('```')[1].split('```')[0].trim();
    }

    try {
      const questions = JSON.parse(content);
      
      // Validate the structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid quiz format');
      }

      // Ensure each question has required fields
      const validQuestions = questions.filter(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length === 4 && 
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 && 
        q.correctAnswer < 4
      );

      if (validQuestions.length === 0) {
        throw new Error('No valid questions generated');
      }

      return {
        questions: validQuestions,
        location: location,
        source: 'AI-generated based on verified cultural data'
      };
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to generate valid quiz format');
    }
  } catch (error) {
    console.error('Indigenous quiz generation failed:', error.message);
    throw error;
  }
};

module.exports = {
  generateNarrative,
  generateContextualNarrative,
  generateCharacter,
  generateIndigenousQuiz
};
