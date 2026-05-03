# PromptWars-2 🗳️🤖

PromptWars-2 is a modern, AI-powered election simulation and civic assistant platform. It combines high-fidelity UI design with intelligent geospatial features to provide users with an immersive experience in navigating election processes, exploring candidates, and getting real-time assistance via AI.

## 🚀 Live Demo
- **Frontend**: [https://promptwars-frontend-29968098990.us-central1.run.app](https://promptwars-frontend-29968098990.us-central1.run.app)
- **Backend API**: [https://promptwars-backend-29968098990.us-central1.run.app](https://promptwars-backend-29968098990.us-central1.run.app)

## ✨ Key Features

- **Intelligent Civic Assistant**: A conversational AI powered by Google's Gemini API, providing context-aware answers about candidates and election procedures.
- **Interactive Polling Maps**: Real-time geospatial visualization of polling booths using Leaflet, allowing users to find their nearest voting locations.
- **Dynamic Candidate Timelines**: Interactive timelines showcasing candidate history, major events, and campaign milestones.
- **Election Process Visualization**: High-fidelity UI components that break down complex civic processes into intuitive, step-by-step guides.
- **Modern Design System**: A premium, responsive interface built with glassmorphism effects, smooth animations, and a sleek dark-themed aesthetic.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Mapping**: Leaflet
- **Deployment**: Google Cloud Run

### Backend
- **Framework**: FastAPI (Python)
- **AI Integration**: Google Generative AI (Gemini 1.5)
- **Containerization**: Docker
- **Deployment**: Google Cloud Run

## ⚙️ Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your API key:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
4. Run the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚢 Deployment (Cloud Run)

The project is configured for seamless deployment to Google Cloud Run using the included `Dockerfile`s.

**Deploy Backend:**
```bash
gcloud run deploy promptwars-backend --source ./backend --set-env-vars GOOGLE_API_KEY=your_key
```

**Deploy Frontend:**
```bash
gcloud run deploy promptwars-frontend --source ./frontend --set-build-env-vars VITE_API_URL=your_backend_url
```

## 📂 Project Structure

```text
├── backend/
│   ├── Dockerfile          # Backend container config
│   ├── main.py             # FastAPI entry point
│   ├── services/           # AI and data logic
│   └── data/               # Mock election data
├── frontend/
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── styles/         # CSS and theme
│   │   └── App.jsx         # Main application logic
│   └── Dockerfile          # Frontend container config
└── README.md               # You are here!
```

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
