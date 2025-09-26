import React, { useState } from 'react';

const ClimateVisualizer = ({ pastData, futureData, loading = false }) => {
  const [viewMode, setViewMode] = useState('comparison');
  const [showCommunityStories, setShowCommunityStories] = useState(false);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gradient-to-r from-orange-200 to-red-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const calculateChange = (past, future) => {
    if (!past || !future) return 0;
    return ((future - past) / past * 100).toFixed(1);
  };

  const getChangeColor = (change) => {
    const num = parseFloat(change);
    if (num > 0) return 'text-red-600';
    if (num < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const communityStories = [
    { author: 'Sarah M.', story: 'The drought of 2019 changed everything for our farm...', location: 'Broken Hill' },
    { author: 'Tom K.', story: 'Bushfires came closer than ever before last summer...', location: 'Coober Pedy' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">Climate Memory Map</h3>
        <p className="text-orange-100 text-sm">Past vs Future Climate Scenarios</p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setViewMode('comparison')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            viewMode === 'comparison'
              ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📊 Comparison
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            viewMode === 'timeline'
              ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📈 Timeline
        </button>
        <button
          onClick={() => setShowCommunityStories(!showCommunityStories)}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            showCommunityStories
              ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          👥 Stories
        </button>
      </div>

      <div className="p-6">
        {viewMode === 'comparison' && (
          <div className="space-y-6">
            {/* Climate Data Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="mr-2">📅</span>
                  Past (1990-2020)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">🌡️ Temperature</span>
                    <span className="font-semibold">{pastData?.temperature || 'N/A'}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">🌧️ Rainfall</span>
                    <span className="font-semibold">{pastData?.rainfall || 'N/A'}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">💨 Wind Speed</span>
                    <span className="font-semibold">{pastData?.wind || 'N/A'}km/h</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                  <span className="mr-2">🔮</span>
                  Future (2050-2080)
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">🌡️ Temperature</span>
                    <span className="font-semibold">{futureData?.temperature || 'N/A'}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">🌧️ Rainfall</span>
                    <span className="font-semibold">{futureData?.rainfall || 'N/A'}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">💨 Wind Speed</span>
                    <span className="font-semibold">{futureData?.wind || 'N/A'}km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Indicators */}
            {pastData && futureData && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">📈 Projected Changes</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${getChangeColor(calculateChange(pastData.temperature, futureData.temperature))}`}>
                      +{calculateChange(pastData.temperature, futureData.temperature)}%
                    </div>
                    <div className="text-xs text-gray-600">Temperature</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${getChangeColor(calculateChange(pastData.rainfall, futureData.rainfall))}`}>
                      {calculateChange(pastData.rainfall, futureData.rainfall)}%
                    </div>
                    <div className="text-xs text-gray-600">Rainfall</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${getChangeColor(calculateChange(pastData.wind, futureData.wind))}`}>
                      +{calculateChange(pastData.wind, futureData.wind)}%
                    </div>
                    <div className="text-xs text-gray-600">Wind Speed</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="mr-2">🤖</span>
                AI Climate Tips
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Install rainwater harvesting systems</li>
                <li>• Plant drought-resistant native vegetation</li>
                <li>• Prepare emergency bushfire evacuation plans</li>
                <li>• Consider solar energy for sustainable power</li>
              </ul>
            </div>
          </div>
        )}

        {showCommunityStories && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-4">Community Climate Stories</h4>
            {communityStories.map((story, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-purple-800">{story.author}</span>
                  <span className="text-xs text-purple-600">{story.location}</span>
                </div>
                <p className="text-sm text-purple-700 italic">"{story.story}"</p>
              </div>
            ))}
            
            <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
              + Share Your Climate Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateVisualizer;
