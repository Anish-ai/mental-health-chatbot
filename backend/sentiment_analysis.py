import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import logging
import os
import numpy as np

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """
    Analyzes the sentiment of text using a BERT-based model.
    """
    def __init__(self):
        try:
            # Use pre-trained model from Hugging Face instead of local fine-tuned model
            model_name = "distilbert-base-uncased-finetuned-sst-2-english"
            logger.info(f"Using pre-trained model from Hugging Face: {model_name}")
            
            # Load the sentiment model
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
            
            # Move to GPU if available
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.model.to(self.device)
            
            # Define emotion labels (based on the model's output)
            self.labels = ["negative", "positive"]  # This specific model has 2 classes
            
            # Fallback emotion words for each category to provide more specific feedback
            self.emotion_words = {
                "positive": ["happy", "joyful", "content", "pleased", "grateful", "excited", "hopeful"],
                "neutral": ["calm", "okay", "fine", "balanced", "steady", "neutral", "composed"],
                "negative": ["sad", "anxious", "worried", "upset", "frustrated", "tired", "concerned"]
            }
            
            logger.info("Sentiment analysis model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading sentiment model: {str(e)}")
            raise
    
    def analyze(self, text):
        """
        Analyze the sentiment of the given text.
        
        Args:
            text (str): The text to analyze
            
        Returns:
            tuple: (sentiment_label, confidence_score)
        """
        try:
            # Prepare input
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=128).to(self.device)
            
            # Get model prediction
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)
                
            # Get predicted class and confidence
            predicted_class = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0][predicted_class].item()
            
            # Get sentiment label
            sentiment = self.labels[predicted_class]
            
            # If we need a "neutral" category, use confidence thresholds
            if 0.4 <= confidence <= 0.6:
                sentiment = "neutral"
            
            logger.info(f"Sentiment analysis: '{text}' -> {sentiment} (confidence: {confidence:.2f})")
            
            return sentiment, confidence
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            # Fallback to neutral sentiment
            return "neutral", 0.33
    
    def get_emotion_word(self, sentiment):
        """
        Get a specific emotion word for the given sentiment category.
        Helps provide more varied and specific feedback to users.
        """
        words = self.emotion_words.get(sentiment, self.emotion_words["neutral"])
        return np.random.choice(words)