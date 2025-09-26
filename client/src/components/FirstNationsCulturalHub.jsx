import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, Users, Clock } from 'lucide-react';

const FirstNationsCulturalHub = ({ location }) => {
  const [culturalData, setCulturalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('language');

  useEffect(() => {
    if (location) {
      fetchCulturalData();
    }
  }, [location]);

  const fetchCulturalData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/first-nations/cultural-hub/${encodeURIComponent(location)}`);
      const data = await response.json();
      setCulturalData(data);
    } catch (error) {
      console.error('Error fetching cultural data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading cultural hub data...</div>;
  if (!culturalData) return null;

  const tabs = [
    { id: 'language', label: 'Language Learning', icon: BookOpen, data: culturalData.languageLearning },
    { id: 'dreamtime', label: 'Dreamtime Stories', icon: MapPin, data: culturalData.dreamtimeStories },
    { id: 'directory', label: 'Cultural Directory', icon: Users, data: culturalData.culturalDirectory },
    { id: 'rights', label: 'Land Rights Timeline', icon: Clock, data: culturalData.landRightsTimeline }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">First Nations Cultural Hub</h2>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="prose max-w-none">
        {tabs.find(tab => tab.id === activeTab)?.data && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="whitespace-pre-wrap text-gray-800">
              {tabs.find(tab => tab.id === activeTab).data}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Cultural Respect:</strong> This content is shared with respect for Indigenous communities. 
          Please engage thoughtfully with traditional knowledge and cultural practices.
        </p>
      </div>
    </div>
  );
};

export default FirstNationsCulturalHub;
