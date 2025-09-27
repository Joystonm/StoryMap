import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LocationSearch from '../components/LocationSearch';
import IndigenousQuiz from '../components/IndigenousQuiz';

const Indigenous = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = async (location) => {
    if (!location) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Location-specific question pools
      const locationQuestions = {
        sydney: [
          {
            question: `What is the traditional Aboriginal name for Sydney Harbour?`,
            options: ['Warrane', 'Kamay', 'Cadi', 'Burramatta'],
            correct: 0,
            explanation: 'Warrane is the traditional Gadigal name for Sydney Harbour, meaning "running water".'
          },
          {
            question: 'Which Aboriginal group are the traditional custodians of Sydney?',
            options: ['Wurundjeri', 'Gadigal', 'Bundjalung', 'Yolŋu'],
            correct: 1,
            explanation: 'The Gadigal people are the traditional custodians of the Sydney area, part of the Eora Nation.'
          }
        ],
        melbourne: [
          {
            question: `What does "Melbourne" mean in the local Aboriginal language?`,
            options: ['Meeting place', 'River bend', 'Sacred ground', 'Hunting ground'],
            correct: 0,
            explanation: 'Melbourne comes from the Wurundjeri word meaning "meeting place by the river".'
          },
          {
            question: 'Which river is sacred to the Wurundjeri people in Melbourne?',
            options: ['Murray River', 'Yarra River', 'Maribyrnong River', 'Plenty River'],
            correct: 1,
            explanation: 'The Yarra River (Birrarung) is sacred to the Wurundjeri people and central to their culture.'
          }
        ],
        brisbane: [
          {
            question: `What is the Aboriginal name for the Brisbane River?`,
            options: ['Maiwar', 'Jindalee', 'Meanjin', 'Turrbal'],
            correct: 0,
            explanation: 'Maiwar is the traditional Aboriginal name for the Brisbane River.'
          },
          {
            question: 'Which Aboriginal groups are traditional owners of Brisbane?',
            options: ['Turrbal and Jagera', 'Gadigal and Eora', 'Wurundjeri and Boon Wurrung', 'Bundjalung and Githabul'],
            correct: 0,
            explanation: 'The Turrbal and Jagera (Yuggera) peoples are the traditional owners of the Brisbane area.'
          }
        ]
      };

      // General questions that work for any location
      const generalQuestions = [
        {
          question: 'What does "Country" mean in Aboriginal culture?',
          options: [
            'Just the land',
            'Land, water, air, trees, rocks, plants, animals, spiritual beings, and ancestral spirits',
            'A political boundary',
            'A place to live'
          ],
          correct: 1,
          explanation: 'In Aboriginal culture, "Country" encompasses all living and non-living elements and the spiritual connections between them.'
        },
        {
          question: `Which traditional practice might have been used around ${location.name}?`,
          options: [
            'Cultural burning',
            'Seasonal migration',
            'Ceremony and storytelling',
            'All of the above'
          ],
          correct: 3,
          explanation: 'Aboriginal peoples used many sustainable practices including cultural burning, seasonal movement, and rich ceremonial traditions.'
        },
        {
          question: 'What are Dreamtime stories?',
          options: [
            'Bedtime stories for children',
            'Creation stories that explain the land, law, and culture',
            'Dreams people have at night',
            'Modern Aboriginal art'
          ],
          correct: 1,
          explanation: 'Dreamtime stories are sacred creation narratives that contain law, culture, and spiritual knowledge passed down through generations.'
        },
        {
          question: 'How long have Aboriginal peoples lived in Australia?',
          options: [
            '10,000 years',
            '30,000 years',
            '65,000+ years',
            '100,000 years'
          ],
          correct: 2,
          explanation: 'Aboriginal peoples are the world\'s oldest continuous culture, with evidence of habitation dating back over 65,000 years.'
        },
        {
          question: `What might be found in traditional Aboriginal art from the ${location.name} region?`,
          options: [
            'Dot paintings and symbols',
            'Stories of local animals and landscapes',
            'Sacred sites and water sources',
            'All of the above'
          ],
          correct: 3,
          explanation: 'Aboriginal art often depicts local stories, animals, landscapes, and sacred sites specific to each region.'
        },
        {
          question: 'What is the significance of totems in Aboriginal culture?',
          options: [
            'They are just decorative objects',
            'They represent spiritual connections to animals, plants, or natural features',
            'They are used for hunting only',
            'They are modern inventions'
          ],
          correct: 1,
          explanation: 'Totems represent deep spiritual connections between Aboriginal people and specific animals, plants, or natural features of their Country.'
        },
        {
          question: `How did Aboriginal people traditionally navigate around areas like ${location.name}?`,
          options: [
            'Using GPS devices',
            'Following roads and maps',
            'Reading the stars, land features, and seasonal changes',
            'Random wandering'
          ],
          correct: 2,
          explanation: 'Aboriginal people developed sophisticated navigation systems using stars, land features, seasonal changes, and traditional knowledge passed down through generations.'
        }
      ];

      // Get location-specific questions if available
      const locationKey = location.name.toLowerCase();
      const specificQuestions = locationQuestions[locationKey] || [];
      
      // Combine specific and general questions
      const allQuestions = [...specificQuestions, ...generalQuestions];
      
      // Randomly select 5 questions
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 5).map((q, index) => ({
        id: index + 1,
        ...q
      }));
      
      setQuestions(selectedQuestions);
      console.log('Generated dynamic quiz for:', location.name, selectedQuestions.length, 'questions');
      
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    generateQuiz(location);
  };

  const handleRegenerateQuiz = () => {
    if (selectedLocation) {
      generateQuiz(selectedLocation);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-orange-600 transition-colors">
                <span className="text-2xl">🌍</span>
                <span className="font-bold text-xl">StoryMap.ai</span>
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">🪃 Indigenous Knowledge</h1>
            </div>
            <Link 
              to="/" 
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Search and Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Location Search */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Explore Indigenous Culture</h2>
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                placeholder="Search Australian locations..."
              />
              <p className="text-sm text-gray-600 mt-3">
                Learn about First Nations culture, languages, and traditions across Australia.
              </p>
            </div>

            {/* Cultural Info */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎨 Cultural Elements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <span className="text-xl">🗣️</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Languages</h4>
                    <p className="text-sm text-gray-600">Over 250 Indigenous languages</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-xl">📖</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dreamtime</h4>
                    <p className="text-sm text-gray-600">Creation stories and spiritual beliefs</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-xl">🎭</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ceremonies</h4>
                    <p className="text-sm text-gray-600">Sacred rituals and traditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Quiz */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🧠 Indigenous Knowledge Quiz</h2>
                
                {!selectedLocation && (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">🪃</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Location</h3>
                    <p className="text-gray-600">Choose an Australian location to start learning about Indigenous culture and traditions.</p>
                  </div>
                )}

                {selectedLocation && loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Generating quiz questions...</p>
                  </div>
                )}

                {selectedLocation && error && (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">❌</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quiz Generation Failed</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={handleRegenerateQuiz}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {selectedLocation && questions.length > 0 && !loading && (
                  <div>
                    <IndigenousQuiz 
                      questions={questions} 
                      location={selectedLocation}
                      onRegenerateQuiz={handleRegenerateQuiz}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indigenous;
