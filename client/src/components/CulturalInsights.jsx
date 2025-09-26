import React, { useState } from 'react';

const CulturalInsights = ({ insights, loading = false, metadata = null }) => {
  const [activeTab, setActiveTab] = useState('music');

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gradient-to-r from-green-200 to-blue-200 rounded w-1/2 mb-6"></div>
          <div className="flex space-x-4 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'music', label: '🎵 Music', icon: '🎵' },
    { id: 'art', label: '🎨 Art', icon: '🎨' },
    { id: 'food', label: '🍽️ Food', icon: '🍽️' },
    { id: 'culture', label: '🏛️ Culture', icon: '🏛️' }
  ];

  const renderContent = () => {
    if (!insights) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎭</div>
          <p className="text-gray-500">Select a location to discover cultural insights</p>
        </div>
      );
    }

    const content = insights[activeTab];
    if (!content) return <p className="text-gray-500">No information available</p>;

    const hasResults = content.items && content.items.length > 0;
    const isNoResultsMessage = content.summary.includes('No local') || content.summary.includes('explore nearby');

    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className={`rounded-lg p-4 ${isNoResultsMessage ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
          <p className={`leading-relaxed ${isNoResultsMessage ? 'text-yellow-800' : 'text-gray-700'}`}>
            {content.summary}
          </p>
        </div>

        {/* Items */}
        {hasResults ? (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <span className="mr-2">Discover More:</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {content.items.length} results
              </span>
            </h4>
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {content.items.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all hover:border-blue-300">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900 flex-1 pr-2">{item.name}</h5>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                      {item.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                  
                  {/* Additional info for music items */}
                  {activeTab === 'music' && item.genres && item.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.genres.map((genre, i) => (
                        <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Date for events */}
                  {item.date && (
                    <p className="text-xs text-gray-500 mb-2">📅 {item.date}</p>
                  )}
                  
                  {/* Location for art items */}
                  {item.location && (
                    <p className="text-xs text-gray-500 mb-2">📍 {item.location}</p>
                  )}
                  
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                    >
                      Learn More 
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : !isNoResultsMessage && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-gray-500">No specific results found for this category</p>
          </div>
        )}

        {/* Interactive Elements for specific tabs */}
        {activeTab === 'music' && hasResults && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">🎧 Music Discovery</h4>
            <p className="text-purple-700 text-sm">Explore the sounds that define this region's cultural identity</p>
          </div>
        )}

        {activeTab === 'art' && hasResults && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-2">🖼️ Art & Galleries</h4>
            <p className="text-orange-700 text-sm">Discover visual arts and cultural expressions from local artists</p>
          </div>
        )}

        {activeTab === 'food' && hasResults && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🍴 Culinary Heritage</h4>
            <p className="text-green-700 text-sm">Taste the flavors that tell the story of this region</p>
          </div>
        )}

        {activeTab === 'culture' && hasResults && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">📚 Cultural Heritage</h4>
            <p className="text-indigo-700 text-sm">Explore landmarks, events, and traditions that shape local identity</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
        <h3 className="text-xl font-bold">Cultural Insights</h3>
        <div className="flex justify-between items-center">
          <p className="text-green-100 text-sm">Discover authentic local culture</p>
          {metadata && (
            <div className="text-xs text-green-200 flex items-center space-x-2">
              <span>📊 Data Quality:</span>
              <span className={`px-2 py-1 rounded ${
                metadata.validation?.totalResults > 5 ? 'bg-green-600' : 
                metadata.validation?.totalResults > 0 ? 'bg-yellow-600' : 'bg-red-600'
              }`}>
                {metadata.validation?.totalResults || 0} results
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map(tab => {
          const hasData = insights && insights[tab.id] && insights[tab.id].items && insights[tab.id].items.length > 0;
          const isNoResults = insights && insights[tab.id] && insights[tab.id].summary.includes('No local');
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <span className="text-lg mb-1">{tab.icon}</span>
                  {hasData && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                  {isNoResults && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></span>
                  )}
                </div>
                <span className="hidden sm:inline">{tab.label.split(' ')[1]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Data Sources Footer */}
      {metadata && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Data sources: MusicBrainz • Tavily • Real-time APIs</span>
              <div className="flex space-x-2">
                {Object.entries(metadata.sources).map(([source, status]) => (
                  <span key={source} className={`px-2 py-1 rounded ${
                    status === 'Available' ? 'bg-green-100 text-green-700' : 
                    status === 'No Results' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {source}: {status}
                  </span>
                ))}
              </div>
            </div>
            <span>Updated: {new Date(metadata.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalInsights;
