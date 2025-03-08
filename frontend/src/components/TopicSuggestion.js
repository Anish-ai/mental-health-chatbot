import React, { useState, useEffect } from 'react';
import { fetchTopicSuggestions } from '../utils/api';

const TopicSuggestion = ({ onSelectTopic }) => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch topic suggestions from the API
    const getTopics = async () => {
      try {
        setIsLoading(true);
        const response = await fetchTopicSuggestions();
        setTopics(response.topics);
      } catch (error) {
        console.error('Error fetching topic suggestions:', error);
        // Fallback topics if API fails
        setTopics([
          'How are you feeling today?',
          'Would you like to talk about your family?',
          'What activities did you enjoy when you were younger?',
          'Have you read any good books lately?'
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    getTopics();
  }, []);

  // Handle topic selection
  const handleSelectTopic = (topic) => {
    onSelectTopic(topic);
  };

  // Don't render if there are no topics or still loading
  if (isLoading) {
    return (
      <div className="topic-suggestions">
        <h3>Suggested conversation starters:</h3>
        <div className="topics-loading">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="topic-suggestions">
      <h3>Not sure what to talk about? Try one of these:</h3>
      <div className="topics-list">
        {topics.map((topic, index) => (
          <button
            key={index}
            className="topic-button"
            onClick={() => handleSelectTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicSuggestion;