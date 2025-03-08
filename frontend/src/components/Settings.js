import React, { useState } from 'react';

const Settings = ({ settings, onSave, onCancel }) => {
  // Create local state to hold form values
  const [formValues, setFormValues] = useState({
    textToSpeech: settings.textToSpeech,
    fontSize: settings.fontSize,
    highContrast: settings.highContrast,
    name: settings.name,
    userName: settings.userName
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Use checked for checkboxes, value for other inputs
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formValues);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <h2>Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h3>Accessibility</h3>
            
            <div className="setting-item">
              <label htmlFor="textToSpeech">
                Text-to-speech:
                <input
                  type="checkbox"
                  id="textToSpeech"
                  name="textToSpeech"
                  checked={formValues.textToSpeech}
                  onChange={handleChange}
                />
              </label>
              <p className="setting-description">
                Have the companion read responses aloud
              </p>
            </div>
            
            <div className="setting-item">
              <label htmlFor="fontSize">
                Text size:
                <select
                  id="fontSize"
                  name="fontSize"
                  value={formValues.fontSize}
                  onChange={handleChange}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </label>
            </div>
            
            <div className="setting-item">
              <label htmlFor="highContrast">
                High contrast mode:
                <input
                  type="checkbox"
                  id="highContrast"
                  name="highContrast"
                  checked={formValues.highContrast}
                  onChange={handleChange}
                />
              </label>
              <p className="setting-description">
                Improve visibility with higher contrast colors
              </p>
            </div>
          </div>
          
          <div className="settings-section">
            <h3>Personalization</h3>
            
            <div className="setting-item">
              <label htmlFor="name">
                Companion's name:
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  maxLength={15}
                />
              </label>
            </div>
            
            <div className="setting-item">
              <label htmlFor="userName">
                Your name:
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formValues.userName}
                  onChange={handleChange}
                  maxLength={20}
                />
              </label>
            </div>
          </div>
          
          <div className="settings-buttons">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;