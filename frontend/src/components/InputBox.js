import React, { useState } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const InputBox = ({ onSendMessage, isLoading, isSpeaking, onStopSpeaking }) => {
  const [message, setMessage] = useState('');
  const { isListening, startListening, stopListening, transcript } = useSpeechRecognition();
  
  // Update message when voice transcript changes
  React.useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // If we were listening, stop
      if (isListening) {
        stopListening();
      }
    }
  };
  
  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const toggleSpeech = () => {
    if (isSpeaking) {
      onStopSpeaking();
    }
  };

  return (
    <form className="input-box" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isListening ? "Listening..." : "Type your message..."}
        disabled={isLoading}
        className={isListening ? "listening" : ""}
      />
      
      <button 
        type="button" 
        className={`voice-button ${isListening ? 'active' : ''}`}
        onClick={toggleVoiceInput}
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
      >
        🎤
      </button>
      
      {isSpeaking && (
        <button 
          type="button" 
          className="stop-speech-button"
          onClick={toggleSpeech}
          aria-label="Stop speaking"
        >
          🔇
        </button>
      )}
      
      <button 
        type="submit" 
        disabled={!message.trim() || isLoading}
        aria-label="Send message"
      >
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
};

export default InputBox;