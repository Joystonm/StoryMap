# StoryMap.ai – Where AI Turns the Outback into Stories

StoryMap.ai is an AI-powered cultural storyteller that transforms maps into living narratives. Instead of just showing roads and pins, it invites users to explore rural Australia's heart — its history, Indigenous heritage, climate challenges, and culture through personalized AI-generated stories, visuals, and recommendations.

Whether you're a student, tourist, researcher, or simply curious, StoryMap.ai helps you understand and appreciate the people, traditions, and struggles that make regional Australia unique.

## 🌟 Core Idea

Turn location data into emotional, interactive stories. By blending Groq-powered AI narratives, TasteDive cultural insights, and Tavily's local knowledge with an interactive Leaflet map, StoryMap.ai lets users explore towns, farms, and remote regions as if guided by a local storyteller.

## 🛠️ Tech Stack

| Layer             | Technology                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------ |
| **Frontend**      | React.js, Tailwind CSS, Leaflet.js                                                         |
| **Backend**       | Node.js + Express (stateless)                                                              |
| **APIs**          | Groq (AI storytelling), Tavily (local data), TasteDive (culture recs), OpenStreetMap (map data) |
| **AI Components** | Groq for text generation, optional AI image generation                                     |


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
