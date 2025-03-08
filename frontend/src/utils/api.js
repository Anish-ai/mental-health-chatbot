// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Get a response from the chatbot API
 * @param {string} message - User's message
 * @param {Array} history - Previous messages in the conversation
 * @returns {Promise<Object>} - Response from the chatbot
 */
export const fetchChatResponse = async (message, history = []) => {
  try {
    // Format conversation history for the API
    const formattedHistory = history
      .filter(msg => msg.text.trim() !== '')
      .map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversation_history: formattedHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chat response:', error);
    throw error;
  }
};

/**
 * Get sentiment analysis for a message
 * @param {string} message - Text to analyze
 * @returns {Promise<Object>} - Sentiment analysis result
 */
export const fetchSentimentAnalysis = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sentiment analysis:', error);
    throw error;
  }
};

/**
 * Get suggested conversation topics
 * @returns {Promise<Array>} - List of conversation topic suggestions
 */
export const fetchTopicSuggestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/topics`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching topic suggestions:', error);
    // Return fallback topics if API fails
    return {
      topics: [
        'How are you feeling today?',
        'Would you like to talk about your family?',
        'What activities did you enjoy when you were younger?',
        'Have you read any good books lately?'
      ]
    };
  }
};