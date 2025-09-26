import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MapView from "../components/MapView";
import LocationSearch from "../components/LocationSearch";
import NarrativeCard from "../components/NarrativeCard";
import { useLocationContext } from "../contexts/LocationContext";
import apiClient from "../utils/apiClient";

const Home = () => {
  const {
    selectedLocation,
    selectedStory,
    loading,
    error,
    setSelectedStory,
    setLoading,
    setError,
    updateLocation,
    navigateWithLocation
  } = useLocationContext();

  const generateStory = async (location) => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/narrative/story", {
        location: location.name,
        theme: "outback adventure",
      });

      setSelectedStory({
        ...response.data,
        location: location.name,
      });
    } catch (err) {
      setError("Failed to generate story. Please try again.");
      setSelectedStory(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    updateLocation(location);
    generateStory(location);
  };

  const handleMapClick = (location) => {
    updateLocation(location);
    generateStory(location);
  };

  // Auto-generate story if location exists but no story
  useEffect(() => {
    if (selectedLocation && !selectedStory && !loading) {
      generateStory(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-rose-500 to-amber-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              StoryMap.ai
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-light mb-2">
              Where AI Turns the Outback into Stories
            </p>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the untold narratives of rural Australia through immersive AI storytelling
            </p>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-white/20 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="relative h-[50vh] sm:h-[60vh] lg:h-[65vh] max-h-[500px]">
          <div className="absolute inset-0 mx-4 sm:mx-6 rounded-2xl overflow-hidden shadow-2xl">
            <MapView 
              selectedLocation={selectedLocation}
              onLocationClick={handleMapClick}
            />
          </div>
        </div>

        {/* Story Panel */}
        {(selectedStory || loading) && (
          <div className="py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <NarrativeCard story={selectedStory} loading={loading} />
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                      <span className="mr-2">✨</span>
                      Explore More
                    </h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => navigateWithLocation("/storyteller")}
                        className="block w-full p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all group text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg group-hover:scale-110 transition-transform">📖</span>
                          <span className="text-sm font-medium text-blue-800">AI Storyteller</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => navigateWithLocation("/explore")}
                        className="block w-full p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all group text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg group-hover:scale-110 transition-transform">🎨</span>
                          <span className="text-sm font-medium text-green-800">Culture Explorer</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => navigateWithLocation("/climate")}
                        className="block w-full p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all group text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg group-hover:scale-110 transition-transform">🌡️</span>
                          <span className="text-sm font-medium text-orange-800">Climate Map</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => navigateWithLocation("/indigenous")}
                        className="block w-full p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all group text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg group-hover:scale-110 transition-transform">🪃</span>
                          <span className="text-sm font-medium text-purple-800">Indigenous Knowledge</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {selectedLocation && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                      <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                        <span className="mr-2">📍</span>
                        Current Location
                      </h3>
                      <p className="text-amber-800 font-medium mb-2">{selectedLocation.name}</p>
                      <p className="text-sm text-amber-700">
                        {selectedLocation.coordinates[0].toFixed(4)}, {selectedLocation.coordinates[1].toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white/80 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore Australia's Hidden Stories
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Every location has a story waiting to be discovered. From remote outback towns to bustling regional centers, 
                uncover the rich tapestry of Australian culture through AI-powered storytelling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <Link to="/storyteller" className="group">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📖</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI Rural Storyteller</h3>
                  <p className="text-gray-600 text-sm">Generate immersive mini-documentaries about towns, farms, and mining areas across Australia.</p>
                </div>
              </Link>

              <Link to="/explore" className="group">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Culture Explorer</h3>
                  <p className="text-gray-600 text-sm">Discover local music, art, food, and traditions that make each region uniquely Australian.</p>
                </div>
              </Link>

              <Link to="/climate" className="group">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🌡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Climate Memory Map</h3>
                  <p className="text-gray-600 text-sm">Explore past vs future climate scenarios and community resilience stories.</p>
                </div>
              </Link>

              <Link to="/indigenous" className="group">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">🪃</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Indigenous Knowledge</h3>
                  <p className="text-gray-600 text-sm">Learn First Nations languages, Dreamtime stories, and cultural traditions.</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
