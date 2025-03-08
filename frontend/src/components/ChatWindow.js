import React, { useRef, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';

const ChatWindow = ({ messages, userName, botName, isBotTyping }) => {
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  return (
    <div className="chat-window">
      {messages.length === 0 ? (
        <div className="empty-chat">
          <p>Start a conversation with {botName}!</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-header">
                <span className="sender-name">
                  {message.sender === 'user' ? userName : botName}
                </span>
                <span className="timestamp">
                  {formatDate(message.timestamp)}
                </span>
              </div>
              <div className="message-content">
                {message.text}
              </div>
            </div>
          ))}
          
          {isBotTyping && (
            <div className="message bot-message typing">
              <div className="message-header">
                <span className="sender-name">{botName}</span>
              </div>
              <div className="message-content">
                <span className="typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatWindow;