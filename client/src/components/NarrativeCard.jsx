import React, { useState } from 'react';

const NarrativeCard = ({ story, loading = false, showActions = true }) => {
  const [isShared, setIsShared] = useState(false);

  const handleShare = () => {
    if (navigator.share && story) {
      navigator.share({
        title: story.title,
        text: story.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${story?.title}\n\n${story?.content}`);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const generateArt = () => {
    console.log('Generating AI art for:', story?.location);
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-8 animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-200 to-rose-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-6 bg-gradient-to-r from-orange-200 to-rose-200 rounded-lg w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Ready to Explore?
        </h3>
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          Search for a location above or click anywhere on the map to discover the hidden stories of rural Australia
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      {/* Story Header */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{story.title}</h3>
              {story.location && (
                <div className="flex items-center text-white/90 text-sm">
                  <span className="mr-1">📍</span>
                  {story.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="p-8">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8 font-light">
          {story.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Story Metadata */}
        {story.theme && (
          <div className="mb-6 inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-100 to-rose-100 text-orange-800 text-sm rounded-full">
            <span className="mr-1">🎭</span>
            {story.theme}
          </div>
        )}

        {/* Story Footer */}
        <div className="pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full flex items-center justify-center mr-2">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span>Generated by AI</span>
          </div>
          <span>{new Date().toLocaleDateString('en-AU', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}</span>
        </div>
      </div>
    </div>
  );
};

export default NarrativeCard;
