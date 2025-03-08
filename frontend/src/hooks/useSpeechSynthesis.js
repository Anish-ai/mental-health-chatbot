import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Get available voices
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Chrome needs this event listener
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }

    getVoices();

    // Cleanup on unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text, options = {}) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    cancel();

    // Create a new utterance
    const newUtterance = new SpeechSynthesisUtterance(text);
    
    // Select a more natural voice if available
    if (voices.length > 0) {
      // Prefer a female voice for the companion
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') || 
        voice.name.includes('Joanna')
      );
      
      newUtterance.voice = preferredVoice || voices[0];
    }
    
    // Set rate and pitch
    newUtterance.rate = options.rate || 0.9; // Slightly slower for elderly users
    newUtterance.pitch = options.pitch || 1.0;
    
    // Set up event handlers
    newUtterance.onstart = () => setIsSpeaking(true);
    newUtterance.onend = () => setIsSpeaking(false);
    newUtterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    };
    
    // Store the utterance to be able to cancel it
    setUtterance(newUtterance);
    
    // Speak
    window.speechSynthesis.speak(newUtterance);
  };

  const cancel = () => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, cancel, isSpeaking, voices };
};

export default useSpeechSynthesis;