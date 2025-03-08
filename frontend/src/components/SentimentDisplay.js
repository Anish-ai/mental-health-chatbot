import React from 'react';

const SentimentDisplay = ({ sentiment }) => {
  // Map sentiment to emoji and description
  const sentimentInfo = {
    positive: {
      emoji: '😊',
      label: 'Positive',
      description: 'You seem to be feeling good!',
      color: '#4caf50' // Green
    },
    neutral: {
      emoji: '😐',
      label: 'Neutral',
      description: 'You seem to be feeling okay.',
      color: '#2196f3' // Blue
    },
    negative: {
      emoji: '😔',
      label: 'Concerned',
      description: 'You seem to be feeling down.',
      color: '#ff9800' // Orange
    }
  };

  // Get info for current sentiment
  const info = sentimentInfo[sentiment] || sentimentInfo.neutral;

  return (
    <div className="sentiment-display" aria-live="polite">
      <div 
        className="sentiment-indicator"
        style={{ backgroundColor: info.color }}
      >
        <span className="sentiment-emoji" aria-hidden="true">
          {info.emoji}
        </span>
        <span className="sentiment-label">
          {info.label}
        </span>
      </div>
      <div className="sentiment-description">
        {info.description}
      </div>
    </div>
  );
};

export default SentimentDisplay;