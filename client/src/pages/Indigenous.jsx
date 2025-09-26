import React, { useState, useEffect } from 'react';
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
      const response = await fetch(`http://localhost:5000/api/indigenous/quiz?location=${encodeURIComponent(location.name)}`);
      const data = await response.json();
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setError('No quiz questions available for this location. Try another location.');
      }
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="text-orange-600 hover:text-orange-800 transition-colors text-sm font-medium">
            ← Back to Home
          </Link>
          <div className="mt-3">
            <h1 className="text-3xl font-bold text-gray-900">Indigenous Knowledge</h1>
            <p className="text-gray-600 mt-1">Learn about Aboriginal culture and traditions through location-specific quizzes</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>

        {/* Info Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🪃</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cultural Learning Hub</h2>
              <p className="text-gray-600">Discover Indigenous knowledge through AI-generated, location-specific quizzes</p>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">
                📍 Learning about: {selectedLocation.name}
              </h3>
              <p className="text-orange-800 text-sm">
                Quiz questions are generated using real cultural and historical data specific to this location.
              </p>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        {loading && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating Quiz...</h3>
            <p className="text-gray-500">Creating questions based on {selectedLocation?.name} cultural knowledge</p>
          </div>
        )}

        {error && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Quiz Generation Failed</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRegenerateQuiz}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && questions.length > 0 && (
          <div className="space-y-6">
            <IndigenousQuiz 
              questions={questions} 
              location={selectedLocation}
              onRegenerateQuiz={handleRegenerateQuiz}
            />
          </div>
        )}

        {!loading && !error && !selectedLocation && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Location to Begin</h3>
            <p className="text-gray-500 mb-6">
              Choose any location in Australia to generate a personalized Indigenous knowledge quiz
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4">
                <div className="text-2xl mb-2">🧠</div>
                <h4 className="font-semibold text-orange-900">AI-Generated</h4>
                <p className="text-sm text-orange-700">Questions created using real cultural data</p>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4">
                <div className="text-2xl mb-2">📍</div>
                <h4 className="font-semibold text-orange-900">Location-Specific</h4>
                <p className="text-sm text-orange-700">Tailored to your chosen area's heritage</p>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-4">
                <div className="text-2xl mb-2">✅</div>
                <h4 className="font-semibold text-orange-900">Fact-Checked</h4>
                <p className="text-sm text-orange-700">Verified using multiple data sources</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Indigenous;
