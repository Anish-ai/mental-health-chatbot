# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import os
import logging
from conversation import ConversationManager
from sentiment_analysis import SentimentAnalyzer
from utils.cache import setup_cache
from utils.metrics import log_api_call
import json
import random

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Setup caching
cache = setup_cache(app)

# Load models
try:
    # Initialize sentiment analysis model
    sentiment_analyzer = SentimentAnalyzer()
    
    # Use pre-trained DialoGPT from Hugging Face instead of fine-tuned model
    logger.info("Using pre-trained DialoGPT from Hugging Face")
    model_name = "microsoft/DialoGPT-medium"  # Can use small/medium/large depending on performance needs
    
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)
    
    # Move model to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    conversation_manager = ConversationManager(model, tokenizer, device)
    
    logger.info(f"Models loaded successfully. Using device: {device}")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise

# Define API routes
@app.route('/api/chat', methods=['POST'])
@log_api_call
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        conversation_history = data.get('conversation_history', [])
        
        if not user_message:
            return jsonify({"error": "No message provided"}), 400
        
        # Generate response
        response = conversation_manager.generate_response(user_message, conversation_history)
        
        return jsonify({
            "response": response,
            "status": "success"
        })
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/sentiment', methods=['POST'])
@cache.cached(timeout=60, key_prefix=lambda: f"sentiment_{request.json.get('message', '')[:50]}")
@log_api_call
def analyze_sentiment():
    try:
        data = request.json
        message = data.get('message', '')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        # Analyze sentiment
        sentiment, confidence = sentiment_analyzer.analyze(message)
        
        return jsonify({
            "sentiment": sentiment,
            "confidence": confidence,
            "message": message
        })
    except Exception as e:
        logger.error(f"Error in sentiment endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/topics', methods=['GET'])
@cache.cached(timeout=3600)  # Cache for 1 hour
@log_api_call
def get_topics():
    try:
        # Topics related to elderly interests and well-being
        topics = [
            "How are you feeling today?",
            "What was your favorite activity when you were younger?",
            "Do you have any family photos you'd like to tell me about?",
            "What's your favorite season and why?",
            "Have you read any good books or watched any good shows lately?",
            "What's the most interesting place you've traveled to?",
            "Do you have any favorite recipes you'd like to share?",
            "What music do you enjoy listening to?",
            "How did you meet your spouse or best friend?"
        ]
        
        # Randomly select 4 topics
        selected_topics = random.sample(topics, min(4, len(topics)))
        
        return jsonify({
            "topics": selected_topics
        })
    except Exception as e:
        logger.error(f"Error in topics endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)