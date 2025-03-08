import torch
import logging
import re
import random

logger = logging.getLogger(__name__)

class ConversationManager:
    """
    Manages conversation state and generates responses using a language model.
    """
    def __init__(self, model, tokenizer, device, max_length=100):
        self.model = model
        self.tokenizer = tokenizer
        self.device = device
        self.max_length = max_length
        
        # Special tokens
        self.eos_token_id = tokenizer.eos_token_id
        
        # Conversation context window
        self.max_history_tokens = 512
        
        # Safety patterns to detect inappropriate content
        self.safety_patterns = [
            r'(?i)sui[c]+ide',
            r'(?i)kill\s+(?:my|your)self',
            r'(?i)harm\s+(?:my|your)self',
            r'(?i)want\s+to\s+die'
        ]
        
        # Empathetic responses for potentially concerning content
        self.safety_responses = [
            "I'm concerned about what you're saying. Would you like to talk about what's troubling you?",
            "That sounds difficult. Remember that it's okay to ask for help when you need it.",
            "I care about your wellbeing. Would you like me to suggest some resources that might help?",
            "I'm here to listen. Would you like to talk more about how you're feeling?"
        ]
        
        # Fallback responses when model fails
        self.fallback_responses = [
            "I'm thinking about what you said. Could you tell me more?",
            "That's interesting. Can you elaborate on that?",
            "I'd like to understand better. Could you share more about that?",
            "Thank you for sharing that with me. How does that make you feel?",
            "I appreciate you talking with me about this. Would you like to continue on this topic?"
        ]

    def generate_response(self, user_message, conversation_history=None):
        """
        Generate a response to the user's message, with safety checks.
        
        Args:
            user_message (str): The message from the user
            conversation_history (list): Previous messages in the conversation
            
        Returns:
            str: The model's response
        """
        try:
            # Check for safety concerns
            if self._contains_concerning_content(user_message):
                return random.choice(self.safety_responses)
            
            # Format conversation history for the model
            input_text = self._format_conversation_history(user_message, conversation_history)
            
            # Encode the input text
            input_ids = self.tokenizer.encode(input_text, return_tensors='pt').to(self.device)
            
            # Truncate if too long
            if input_ids.shape[1] > self.max_history_tokens:
                input_ids = input_ids[:, -self.max_history_tokens:]
            
            # Generate response
            output = self.model.generate(
                input_ids,
                max_length=input_ids.shape[1] + self.max_length,
                pad_token_id=self.tokenizer.eos_token_id,
                no_repeat_ngram_size=3,
                do_sample=True,
                top_p=0.92,
                top_k=50,
                temperature=0.85,
                num_return_sequences=1,
            )
            
            # Decode the response
            response = self.tokenizer.decode(output[0][input_ids.shape[1]:], skip_special_tokens=True)
            
            # Clean up the response
            response = self._clean_response(response)
            
            return response if response else random.choice(self.fallback_responses)
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return random.choice(self.fallback_responses)
    
    def _format_conversation_history(self, user_message, conversation_history=None):
        """
        Format the conversation history for the model.
        """
        if not conversation_history:
            return f"User: {user_message}\nAssistant:"
        
        formatted_history = []
        
        # Add previous exchanges (limited to last 5 to keep context manageable)
        for message in conversation_history[-10:]:
            role = "User" if message['sender'] == 'user' else "Assistant"
            formatted_history.append(f"{role}: {message['text']}")
        
        # Add current message
        formatted_history.append(f"User: {user_message}")
        formatted_history.append("Assistant:")
        
        return "\n".join(formatted_history)
    
    def _clean_response(self, response):
        """
        Clean up model response to make it more natural.
        """
        # Remove extra whitespace
        response = response.strip()
        
        # Handle incomplete sentences
        if response and not any(response.endswith(end) for end in ['.', '!', '?']):
            response = response.rsplit(' ', 1)[0] + '.'
        
        # Replace multiple spaces with single space
        response = re.sub(r'\s+', ' ', response)
        
        # Limit length for elderly users (easier to read)
        if len(response) > 200:
            sentences = re.split(r'(?<=[.!?])\s+', response)
            shortened = []
            current_length = 0
            
            for sentence in sentences:
                if current_length + len(sentence) <= 200:
                    shortened.append(sentence)
                    current_length += len(sentence) + 1  # +1 for space
                else:
                    break
            
            response = ' '.join(shortened)
        
        return response
    
    def _contains_concerning_content(self, text):
        """
        Check if the message contains concerning content that requires special handling.
        """
        for pattern in self.safety_patterns:
            if re.search(pattern, text):
                logger.warning(f"Safety pattern detected: {pattern}")
                return True
        
        return False