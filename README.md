# StoryMap.ai – Where AI Turns the Outback into Stories

StoryMap.ai is an AI-powered cultural storyteller that transforms maps into living narratives. Instead of just showing roads and pins, it invites users to explore rural Australia's heart — its history, Indigenous heritage, climate challenges, and culture — through personalized AI-generated stories, visuals, and recommendations.

Whether you're a student, tourist, researcher, or simply curious, StoryMap.ai helps you understand and appreciate the people, traditions, and struggles that make regional Australia unique.

## 🌟 Core Idea

Turn location data into emotional, interactive stories. By blending Groq-powered AI narratives, Qloo cultural insights, and Tavily's local knowledge with an interactive Leaflet map, StoryMap.ai lets users explore towns, farms, and remote regions as if guided by a local storyteller.

## ✨ Feature Highlights

### 🎨 Outback Culture Explorer

- **AI Narratives**: Groq generates engaging, human-like stories about local culture
- **Cultural Recommendations**: Qloo provides music, art, and film suggestions from each region
- **Interactive Media**: Users can listen to songs and view artwork, turning learning into an immersive experience
- **Map Overlays**: Leaflet highlights museums, indigenous landmarks, and local events

### 📖 AI Rural Storyteller

- **Mini Documentaries**: Select a town/farm/mining area → get multi-paragraph AI-curated narratives blending history, industry, and human stories
- **AI-Generated Art**: Visual interpretations of a region's past, present, or imagined future
- **Shareable Stories**: One-click share to social media — perfect for tourism campaigns or educators

### 🌡️ Climate Memory Map

- **Past vs Future**: Interactive before/after visualizations for bushfire-hit, flood-prone, or drought-affected areas
- **AI Tips**: Groq suggests preparation measures and local support resources
- **Community Input**: Crowdsource stories and experiences to enrich the map's emotional depth

### 🪃 Indigenous Knowledge Preserver

- **Language Revival**: Learn words and phrases from endangered First Nations languages
- **Dreamtime Stories**: AI curates and retells indigenous myths tied to the land
- **Art & Music**: Qloo recommends indigenous creators and music playlists
- **Interactive Quizzes**: Gamified cultural learning experiences

## 🚀 How It Works

1. **User Opens App** → Clean map interface with search bar and "Explore" button
2. **Location Selection** → Click map pin or search for a town
3. **Backend Fetches Data** (No Database Needed):
   - Tavily → Local events, history snippets
   - Qloo → Culture, art, music, movies
   - Groq → Generates stories, tips, and contextual insights
4. **Frontend Displays Result**:
   - Map zooms to selected area
   - Left panel shows narrative, music, art suggestions
   - Right panel shows climate visualization (if relevant)
   - Optional "Generate Art" button for AI-generated images
5. **User Interacts & Shares** → Save, share, or explore nearby towns

## 🎨 UI/UX Vision

- **Landing Page**: Hero section with tagline "Explore the untold stories of rural Australia"
- **Map-First Layout**: Interactive map with scrollable narrative panel
- **Mood**: Soft, earthy tones giving an authentic Outback vibe
- **Animations**: Smooth transitions when zooming or loading stories

## 🛠️ Tech Stack

| Layer             | Technology                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------ |
| **Frontend**      | React.js, Tailwind CSS, Leaflet.js                                                         |
| **Backend**       | Node.js + Express (stateless)                                                              |
| **APIs**          | Groq (AI storytelling), Tavily (local data), Qloo (culture recs), OpenStreetMap (map data) |
| **AI Components** | Groq for text generation, optional AI image generation                                     |

## 🌟 Why It's Unique

- ✅ **Transforms maps into stories** → not just data visualization
- ✅ **Blends education + entertainment** → ideal for students & tourists
- ✅ **Celebrates Indigenous culture** → raises awareness & preserves knowledge
- ✅ **Gamified exploration** → keeps users engaged longer
- ✅ **Hackathon-ready** → lightweight, real-time, no DB needed

## 🌍 Potential Impact

### For Locals

- Revives pride in small towns & indigenous roots
- Raises awareness about climate impact & resilience

### For Tourists

- Creates a cultural guidebook for hidden gems
- Provides authentic, AI-curated travel experiences

### For Educators

- Becomes a teaching tool for Australian history & geography
- Interactive learning about Indigenous culture and climate science

### For Communities

- Platform for sharing local stories and experiences
- Preserves cultural knowledge for future generations

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Add your API keys for Groq, Qloo, and Tavily
   ```

3. **Run development servers:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   Frontend: http://localhost:3000
   Backend: http://localhost:5000
   ```

## 📁 Project Structure

```
├── client/                         # React Frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Route components
│   │   ├── hooks/                  # Custom React hooks
│   │   └── utils/                  # Helper functions
│   └── package.json
│
├── server/                         # Node.js Backend
│   ├── config/                     # API configuration
│   ├── controllers/                # Route handlers
│   ├── routes/                     # API routes
│   ├── services/                   # External API integrations
│   └── package.json
│
├── .env                           # Environment variables
└── package.json                   # Root package configuration
```

## 🔧 API Integration

### Groq (AI Storytelling)

- Generate location-based narratives
- Create character profiles
- Produce climate change stories
- Generate educational quiz questions

### Qloo (Cultural Recommendations)

- Music recommendations by region
- Art and cultural insights
- Local cultural events and attractions

### Tavily (Real-time Search)

- Historical information about locations
- Climate data and projections
- Indigenous knowledge and learning resources

### OpenStreetMap (Geographic Data)

- Location search and geocoding
- Map tiles and geographic boundaries
- Points of interest mapping

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**StoryMap.ai** - Transforming the way we explore and understand rural Australia through the power of AI storytelling. 🇦🇺✨
