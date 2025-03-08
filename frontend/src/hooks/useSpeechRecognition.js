import { useState, useEffect } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  // Create recognition object
  let recognition = null;
  
  // Check if the browser supports speech recognition
  const isSpeechRecognitionSupported = () => {
    return 'SpeechRecognition' in window || 
           'webkitSpeechRecognition' in window ||
           'mozSpeechRecognition' in window || 
           'msSpeechRecognition' in window;
  };

  // Initialize speech recognition
  const initRecognition = () => {
    if (!isSpeechRecognitionSupported()) {
      setError('Speech recognition is not supported in this browser.');
      return null;
    }

    // Get the speech recognition constructor
    const SpeechRecognition = window.SpeechRecognition || 
                             window.webkitSpeechRecognition || 
                             window.mozSpeechRecognition || 
                             window.msSpeechRecognition;
    
    const recognition = new SpeechRecognition();
    
    // Configure the recognition
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';  // Default to English
    
    // Set up event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };
    
    recognition.onresult = (event) => {
      // Get the last result
      const lastResultIndex = event.results.length - 1;
      const lastResult = event.results[lastResultIndex];
      
      // Get the transcript
      const currentTranscript = lastResult[0].transcript;
      
      // Update the transcript
      setTranscript(currentTranscript);
    };
    
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    return recognition;
  };

  // Start listening
  const startListening = () => {
    if (!recognition) {
      recognition = initRecognition();
    }
    
    if (recognition) {
      setTranscript('');
      recognition.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: isSpeechRecognitionSupported()
  };
};

export default useSpeechRecognition;