import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LocationSearch from '../components/LocationSearch';
import { useLocationContext } from '../contexts/LocationContext';
import apiClient from '../utils/apiClient';

const StoryCard = ({ story, isExpanded, onToggle }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{story.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-blue-100 text-xs">Story #{story.id}</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className={`prose prose-sm max-w-none text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
          {story.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={onToggle}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StoryTeller = () => {
  const { selectedLocation, updateLocation } = useLocationContext();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedStories, setExpandedStories] = useState(new Set());
  const [dataContext, setDataContext] = useState(null);

  const generateStories = async (location) => {
    setLoading(true);
    setError('');
    setStories([]); // Clear existing stories
    setExpandedStories(new Set()); // Reset expanded state
    
    try {
      console.log('Generating multiple stories for:', location.name);
      
      const response = await apiClient.post('/narrative/stories', {
        location: location.name
      });
      
      setStories(response.data.stories || []);
      setDataContext(response.data.dataContext);
    } catch (err) {
      console.error('Stories generation error:', err);
      setError('Failed to generate stories. Please try again.');
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    updateLocation(location);
    generateStories(location);
  };

  const toggleStoryExpansion = (storyId) => {
    const newExpanded = new Set(expandedStories);
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId);
    } else {
      newExpanded.add(storyId);
    }
    setExpandedStories(newExpanded);
  };

  // Auto-generate stories if location exists but no stories loaded
  useEffect(() => {
    if (selectedLocation && stories.length === 0 && !loading) {
      generateStories(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">AI Rural Storyteller</h1>
          <p className="text-gray-600 mt-2">Generate unique stories about Australia's outback regions</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-white/20 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Location Info */}
        {selectedLocation && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Stories from {selectedLocation.name}</h2>
            <p className="text-blue-700">Discover the rich narratives that make this place unique</p>
            
            {dataContext && (
              <div className="mt-4 flex space-x-4 text-sm">
                <span className={`px-2 py-1 rounded ${dataContext.historical === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  📚 Historical Data: {dataContext.historical}
                </span>
                <span className={`px-2 py-1 rounded ${dataContext.cultural === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  🎭 Cultural Data: {dataContext.cultural}
                </span>
                <span className={`px-2 py-1 rounded ${dataContext.climate === 'Available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  🌡️ Climate Data: {dataContext.climate}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div className="mt-4 h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Stories Grid */}
        {stories.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                isExpanded={expandedStories.has(story.id)}
                onToggle={() => toggleStoryExpansion(story.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!selectedLocation && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Create Stories?</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Search for any Australian location above to generate unique, AI-powered stories based on real historical and cultural data.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoryTeller;
