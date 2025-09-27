import React, { useState } from 'react';

const CulturalInsights = ({ insights, loading, error }) => {
  const [activeTab, setActiveTab] = useState('music');

  const tabs = [
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'art', label: 'Art', icon: '🎨' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'events', label: 'Events', icon: '🎪' }
  ];

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Cultural Insights</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">🎭</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Location</h3>
          <p className="text-gray-600">Choose a location to explore its cultural heritage</p>
        </div>
      </div>
    );
  }

  const currentContent = insights[activeTab];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🎭 Cultural Insights</h2>
        <p className="text-green-100">Discover the rich cultural heritage of this region</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => {
            const hasData = insights[tab.id] && insights[tab.id].items && insights[tab.id].items.length > 0;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-6 py-4 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {hasData && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {insights[tab.id].items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentContent ? (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{currentContent.title}</h3>
            {currentContent.summary && (
              <p className="text-gray-600 mb-6">{currentContent.summary}</p>
            )}
            
            {currentContent.items && currentContent.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContent.items.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                    {item.artist && (
                      <p className="text-sm text-gray-600 mb-1">Artist: {item.artist}</p>
                    )}
                    {item.genre && (
                      <p className="text-sm text-gray-600 mb-1">Genre: {item.genre}</p>
                    )}
                    {item.medium && (
                      <p className="text-sm text-gray-600 mb-1">Medium: {item.medium}</p>
                    )}
                    {item.type && (
                      <p className="text-sm text-gray-600 mb-1">Type: {item.type}</p>
                    )}
                    {item.date && (
                      <p className="text-sm text-gray-600 mb-1">Date: {item.date}</p>
                    )}
                    <p className="text-sm text-gray-700">{item.description}</p>
                    {item.url && item.url !== '#' && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Learn More →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : activeTab === 'events' && insights.events ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.events.map((event, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{event.name}</h4>
                    <p className="text-sm text-gray-600 mb-1">Date: {event.date}</p>
                    <p className="text-sm text-gray-700">{event.description}</p>
                    {event.url && event.url !== '#' && (
                      <a 
                        href={event.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Event Details →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📭</div>
                <p className="text-gray-600">No {activeTab} data available for this location</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📭</div>
            <p className="text-gray-600">No cultural insights available</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Data sources: TasteDive • Cultural Heritage Database</span>
          <div className="flex space-x-2">
            <span className="px-2 py-1 rounded bg-green-100 text-green-700">
              TasteDive: Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalInsights;
