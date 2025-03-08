import React, { useEffect, useState } from 'react';

const Avatar = ({ mood, name }) => {
  const [animation, setAnimation] = useState('idle');
  
  // Change animation based on mood
  useEffect(() => {
    switch(mood) {
      case 'positive':
        setAnimation('happy');
        break;
      case 'negative':
        setAnimation('concerned');
        break;
      case 'neutral':
      default:
        setAnimation('idle');
        break;
    }
    
    // Reset to idle after 3 seconds
    const timer = setTimeout(() => {
      setAnimation('idle');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [mood]);
  
  // Render different faces based on mood/animation
  const renderFace = () => {
    switch(animation) {
      case 'happy':
        return (
          <>
            <div className="eyes">
              <div className="eye left">
                <div className="pupil happy"></div>
              </div>
              <div className="eye right">
                <div className="pupil happy"></div>
              </div>
            </div>
            <div className="mouth happy"></div>
          </>
        );
      case 'concerned':
        return (
          <>
            <div className="eyes">
              <div className="eye left concerned">
                <div className="pupil"></div>
              </div>
              <div className="eye right concerned">
                <div className="pupil"></div>
              </div>
            </div>
            <div className="mouth concerned"></div>
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <div className="eyes">
              <div className="eye left">
                <div className="pupil"></div>
              </div>
              <div className="eye right">
                <div className="pupil"></div>
              </div>
            </div>
            <div className="mouth neutral"></div>
          </>
        );
    }
  };
  
  return (
    <div className="avatar-container">
      <div className={`avatar ${animation}`}>
        {renderFace()}
      </div>
      <div className="avatar-name">{name}</div>
    </div>
  );
};

export default Avatar;