# Smart AI Companion for Mental Well-being

A conversational AI system designed to support elderly individuals through meaningful interactions, emotional health monitoring, and companionship to reduce loneliness.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Training Models](#training-models)
- [Usage](#usage)
- [Deployment](#deployment)
- [Development Guidelines](#development-guidelines)
- [Performance Optimization](#performance-optimization)
- [Accessibility Features](#accessibility-features)
- [Troubleshooting](#troubleshooting)

## 🌟 Overview

The Smart AI Companion is designed to enhance the mental well-being of elderly individuals through:

- **Meaningful Conversations**: Engaging dialogues powered by fine-tuned DialoGPT models
- **Emotional Health Monitoring**: Real-time sentiment analysis to track emotional states
- **Accessibility-First Design**: User interface optimized for elderly users with various accessibility needs
- **Privacy-Focused Architecture**: Secure handling of conversational data and user preferences

## ✨ Features

### Conversational AI
- Context-aware responses using DialoGPT fine-tuned on elderly-appropriate conversations
- Memory of previous interactions to maintain conversational coherence
- Personalized conversation style based on user preferences

### Emotion Detection
- Real-time sentiment analysis using BERT models
- Emotion tracking over time with visualizations
- Adaptive responses based on detected emotional states

### Enhanced User Experience
- Text-to-speech functionality for users with visual impairments
- Speech recognition for hands-free interaction
- High-contrast, large-text interface designed for elderly users
- Animated companion avatar providing visual feedback

### Conversation Management
- Topic suggestions to spark new discussions
- Gentle redirection when conversations become negative
- Periodic check-ins during extended periods of inactivity

## 🗂️ Project Structure

```
project-root/  
├── frontend/                        # React Frontend (Enhanced UI)  
│   ├── public/  
│   │   ├── index.html  
│   │   ├── logo.svg                 # App logo
│   │   └── sounds/                  # Audio files for notifications
│   ├── src/  
│   │   ├── components/              # Reusable React components
│   │   │   ├── Avatar.js            # Animated avatar component
│   │   │   ├── ChatWindow.js        # Chat display component
│   │   │   ├── InputBox.js          # Enhanced input component
│   │   │   ├── SentimentDisplay.js  # Sentiment visualization
│   │   │   ├── Settings.js          # User preferences
│   │   │   ├── TopicSuggestion.js   # Conversation starters
│   │   │   └── WelcomeScreen.js     # Onboarding component
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useSpeechRecognition.js  # Voice input
│   │   │   ├── useSpeechSynthesis.js    # Text-to-speech
│   │   │   └── useLocalStorage.js       # Persistent settings
│   │   ├── utils/                   # Helper functions
│   │   │   ├── api.js               # API communication
│   │   │   └── dateUtils.js         # Date formatting
│   │   ├── App.js                   # Main App component
│   │   ├── index.css                # Global styles
│   │   └── index.js                 # Entry point
│   └── package.json                 # Frontend dependencies
├── backend/                         # Enhanced Flask + ML Backend  
│   ├── app.py                       # Main Flask application
│   ├── conversation.py              # Conversation state management
│   ├── sentiment_analysis.py        # Enhanced sentiment analysis
│   ├── models.py                    # Database models
│   ├── utils/                       # Backend utilities
│   │   ├── auth.py                  # Authentication helpers
│   │   ├── cache.py                 # Response caching
│   │   └── metrics.py               # Performance monitoring
│   ├── requirements.txt             # Python dependencies
│   └── ml_models/                   # Fine-tuned Models
│       ├── fine_tuned_dialogpt/     # Fine-tuned chatbot model
│       └── fine_tuned_bert/         # Fine-tuned sentiment model
├── ml_training/                     # Enhanced ML Training Code  
│   ├── train_chatbot.py             # DialoGPT fine-tuning script
│   ├── train_sentiment.py           # BERT sentiment training
│   ├── evaluate_models.py           # Model evaluation script
│   └── utils/                       # Training utilities
│       ├── data_processing.py       # Data preparation
│       └── metrics.py               # Custom evaluation metrics
├── datasets/                        # Training Data  
│   ├── elderly_conversations/       # Age-appropriate dialogues
│   ├── daily_dialog/                # General conversations
│   └── sentiment_data/              # Emotion labeling data
├── docker/                          # Containerization
│   ├── Dockerfile.frontend          # Frontend container
│   ├── Dockerfile.backend           # Backend container
│   └── docker-compose.yml           # Multi-container setup
└── README.md                        # Project documentation
```

## 🔧 Installation

### Prerequisites

- Node.js (v16+)
- Python (3.9+)
- npm or yarn
- pip
- (Optional) CUDA-compatible GPU for model training

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`.

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend API will be available at `http://localhost:5000`.

### Training Models

```bash
# Navigate to ml_training directory
cd ml_training

# Run the training scripts
python train_chatbot.py
python train_sentiment.py

# Evaluate model performance
python evaluate_models.py
```

Trained models will be saved to `backend/ml_models/`.

## 🚀 Usage

### Local Development

1. Start both frontend and backend servers as described in the installation section
2. Open your browser to `http://localhost:3000`
3. The initial setup wizard will guide you through the companion configuration

### Docker Setup

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

## 📦 Deployment

### Frontend Deployment

```bash
# Build production version
cd frontend
npm run build

# Deploy to Netlify or Vercel
npx netlify deploy --prod --dir=build
# or
vercel --prod
```

### Backend Deployment

```bash
# Deploy to Heroku or Render
cd backend
heroku create
git push heroku main

# Set environment variables
heroku config:set MODEL_PATH=ml_models/fine_tuned_dialogpt
```

## 🛠️ Development Guidelines

### Code Style

- Frontend: Follow React best practices
- Backend: Follow PEP 8 guidelines for Python code

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Individual feature branches

## ⚡ Performance Optimization

### Model Optimization

- Use `onnx` runtime for faster inference
- Consider quantized models for reduced memory footprint
- Implement response caching for common questions

### Frontend Optimization

- Lazy load components
- Implement virtualized lists for chat history
- Use Web Workers for intensive client-side operations

## ♿ Accessibility Features

### Vision Support
- High contrast theme
- Adjustable font sizes
- Text-to-speech for all companion responses

### Hearing Support
- Visual indicators for audio cues
- Caption support for voice interactions

### Motor Support
- Voice commands for hands-free operation
- Simple, large-target UI controls

## 🔍 Troubleshooting

### Common Issues

#### CORS Errors
```python
# Add to app.py
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

#### Model Loading Errors
- Ensure model paths are correct
- Check CUDA version compatibility
- Try reducing model size or using CPU fallback

#### Memory Issues
- Implement model unloading when inactive
- Use smaller batch sizes
- Consider distilled versions of models

---

Developed to provide companionship and support for elderly individuals.