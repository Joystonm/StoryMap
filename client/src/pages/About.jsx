import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-orange-600 hover:underline">← Back to Home</Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">About StoryMap.ai</h1>
          <p className="text-orange-700 mt-2">Where AI Turns the Outback into Stories</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Mission Statement */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Mission</h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            StoryMap.ai is an AI-powered cultural storyteller that transforms maps into living narratives. 
            Instead of just showing roads and pins, we invite users to explore rural Australia's heart — 
            its history, Indigenous heritage, climate challenges, and culture — through personalized 
            AI-generated stories, visuals, and recommendations.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you're a student, tourist, researcher, or simply curious, StoryMap.ai helps you 
            understand and appreciate the people, traditions, and struggles that make regional Australia unique.
          </p>
        </div>

        {/* Core Idea */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">Core Idea</h3>
          <p className="text-blue-700 leading-relaxed">
            Turn location data into emotional, interactive stories. By blending Groq-powered AI narratives, 
            Qloo cultural insights, and Tavily's local knowledge with an interactive Leaflet map, 
            StoryMap.ai lets users explore towns, farms, and remote regions as if guided by a local storyteller.
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Feature Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <span className="mr-2 text-xl">🎨</span>
                Outback Culture Explorer
              </h4>
              <ul className="text-green-700 text-sm space-y-2">
                <li>• AI-generated cultural narratives</li>
                <li>• Music, art, and film recommendations</li>
                <li>• Interactive media experiences</li>
                <li>• Indigenous landmarks mapping</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <span className="mr-2 text-xl">📖</span>
                AI Rural Storyteller
              </h4>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Mini documentaries of towns & farms</li>
                <li>• AI-generated visual interpretations</li>
                <li>• Shareable social media stories</li>
                <li>• Historical narrative blending</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-800 mb-3 flex items-center">
                <span className="mr-2 text-xl">🌡️</span>
                Climate Memory Map
              </h4>
              <ul className="text-orange-700 text-sm space-y-2">
                <li>• Past vs future visualizations</li>
                <li>• AI climate preparation tips</li>
                <li>• Community story crowdsourcing</li>
                <li>• Bushfire & drought impact mapping</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                <span className="mr-2 text-xl">🪃</span>
                Indigenous Knowledge Preserver
              </h4>
              <ul className="text-purple-700 text-sm space-y-2">
                <li>• First Nations language revival</li>
                <li>• Dreamtime story curation</li>
                <li>• Indigenous art & music discovery</li>
                <li>• Gamified cultural learning</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why It's Unique */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 border-l-4 border-yellow-500">
          <h3 className="text-xl font-semibold mb-4 text-yellow-800">Why StoryMap.ai is Unique</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">🗺️</span>
                <span className="text-yellow-700 text-sm">Transforms maps into stories — not just data visualization</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">🎓</span>
                <span className="text-yellow-700 text-sm">Blends education + entertainment — ideal for students & tourists</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">🏛️</span>
                <span className="text-yellow-700 text-sm">Celebrates Indigenous culture — raises awareness & preserves knowledge</span>
              </div>
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">🎮</span>
                <span className="text-yellow-700 text-sm">Gamified exploration — keeps users engaged longer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Technology Stack</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚛️</span>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Frontend</h4>
              <p className="text-sm text-blue-600">React.js, Tailwind CSS, Leaflet.js</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Backend</h4>
              <p className="text-sm text-green-600">Node.js, Express (stateless)</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">AI & APIs</h4>
              <p className="text-sm text-purple-600">Groq, Qloo, Tavily, OpenStreetMap</p>
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 border-l-4 border-green-500">
          <h3 className="text-xl font-semibold mb-4 text-green-800">Potential Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2">For Communities</h4>
              <ul className="text-green-600 text-sm space-y-1">
                <li>• Revives pride in small towns & indigenous roots</li>
                <li>• Raises awareness about climate impact & resilience</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-700 mb-2">For Education & Tourism</h4>
              <ul className="text-green-600 text-sm space-y-1">
                <li>• Creates cultural guidebook for hidden gems</li>
                <li>• Becomes teaching tool for Australian history & geography</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
          <p className="mb-6 text-orange-100">
            Discover the untold stories of rural Australia through AI-powered narratives and interactive maps.
          </p>
          <Link 
            to="/" 
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Start Your Journey →
          </Link>
        </div>
      </main>
    </div>
  );
};

export default About;
