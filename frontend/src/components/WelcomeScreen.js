import React, { useState } from 'react';

const WelcomeScreen = ({ onComplete }) => {
  const [userName, setUserName] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to Your AI Companion",
      content: (
        <>
          <p className="welcome-text">
            Hello! I'm your friendly AI companion. I'm here to chat with you, 
            listen to your thoughts, and keep you company.
          </p>
          <p className="welcome-text">
            We can talk about anything you'd like - your day, your memories, 
            current events, or just have a friendly conversation.
          </p>
          <button 
            className="welcome-button"
            onClick={() => setCurrentStep(1)}
          >
            Get Started
          </button>
        </>
      )
    },
    {
      title: "Let's Get to Know Each Other",
      content: (
        <>
          <p className="welcome-text">
            I'd love to know what to call you. What's your name?
          </p>
          <div className="name-input-container">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="name-input"
              aria-label="Your name"
            />
          </div>
          <button 
            className="welcome-button"
            onClick={() => setCurrentStep(2)}
            disabled={!userName.trim()}
          >
            Continue
          </button>
        </>
      )
    },
    {
      title: "How I Can Help",
      content: (
        <>
          <p className="welcome-text">
            Nice to meet you, {userName}! Here's what I can do:
          </p>
          <ul className="features-list">
            <li>Have friendly conversations</li>
            <li>Listen to your stories and memories</li>
            <li>Suggest topics if you're not sure what to talk about</li>
            <li>Respond to voice input if you prefer speaking</li>
          </ul>
          <p className="welcome-text">
            I'm here to be a friendly companion whenever you want to chat.
          </p>
          <button 
            className="welcome-button"
            onClick={() => onComplete(userName)}
          >
            Start Chatting
          </button>
        </>
      )
    }
  ];
  
  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <h1 className="welcome-title">{steps[currentStep].title}</h1>
        <div className="welcome-content">
          {steps[currentStep].content}
        </div>
        <div className="step-indicator">
          {steps.map((_, index) => (
            <span 
              key={index} 
              className={`step-dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;