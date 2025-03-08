import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';
import SentimentDisplay from './components/SentimentDisplay';
import Avatar from './components/Avatar';
import WelcomeScreen from './components/WelcomeScreen';
import TopicSuggestion from './components/TopicSuggestion';
import Settings from './components/Settings';
import { fetchChatResponse, fetchSentimentAnalysis } from './utils/api';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentSentiment, setCurrentSentiment] = useState('neutral');
  const [isWelcomeScreenVisible, setIsWelcomeScreenVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useLocalStorage('companion-settings', {
    textToSpeech: true,
    fontSize: 'medium',
    highContrast: false,
    name: 'Companion',
    userName: 'Friend'
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { speak, isSpeaking, cancel } = useSpeechSynthesis();

  useEffect(() => {
    // Check if first time user
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setIsWelcomeScreenVisible(false);
      
      // Add welcome back message
      const timeOfDay = getTimeOfDay();
      addBotMessage(`Good ${timeOfDay}, ${settings.userName}! How are you feeling today?`);
    }
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const completeOnboarding = (userName) => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setSettings({...settings, userName});
    setIsWelcomeScreenVisible(false);
    
    // Add welcome message after onboarding
    addBotMessage(`It's wonderful to meet you, ${userName}! I'm ${settings.name}, your companion. How are you doing today?`);
  };

  const addBotMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Speak message if text-to-speech is enabled
    if (settings.textToSpeech) {
      speak(text);
    }
  };

  const handleSendMessage = async (text) => {
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Get sentiment analysis
      const sentimentResponse = await fetchSentimentAnalysis(text);
      setCurrentSentiment(sentimentResponse.sentiment);
      
      // Get chatbot response
      const chatbotResponse = await fetchChatResponse(text, messages);
      
      // Add bot message
      addBotMessage(chatbotResponse.response);
    } catch (error) {
      console.error("Error communicating with backend:", error);
      addBotMessage("I'm having trouble connecting right now. Could we try again in a moment?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelection = (topic) => {
    handleSendMessage(topic);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className={`app ${settings.highContrast ? 'high-contrast' : ''} font-size-${settings.fontSize}`}>
      {isWelcomeScreenVisible ? (
        <WelcomeScreen onComplete={completeOnboarding} />
      ) : (
        <>
          <header>
            <h1>Your AI Companion</h1>
            <button 
              className="settings-button" 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Settings"
            >
              ⚙️
            </button>
          </header>
          
          <main>
            <div className="companion-container">
              <Avatar mood={currentSentiment} name={settings.name} />
              <SentimentDisplay sentiment={currentSentiment} />
            </div>
            
            <div className="chat-container">
              <ChatWindow 
                messages={messages} 
                userName={settings.userName}
                botName={settings.name}
                isBotTyping={isLoading}
              />
              
              <InputBox 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
                isSpeaking={isSpeaking}
                onStopSpeaking={cancel}
              />
              
              {messages.length < 3 && (
                <TopicSuggestion onSelectTopic={handleTopicSelection} />
              )}
            </div>
          </main>
          
          {isSettingsOpen && (
            <Settings 
              settings={settings} 
              onSave={(newSettings) => {
                updateSettings(newSettings);
                setIsSettingsOpen(false);
              }}
              onCancel={() => setIsSettingsOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;