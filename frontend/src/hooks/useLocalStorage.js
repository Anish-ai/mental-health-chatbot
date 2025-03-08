import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting state in localStorage
 * 
 * @param {string} key - The localStorage key to use
 * @param {any} initialValue - The initial value if no value exists in localStorage
 * @returns {Array} [storedValue, setValue] - Similar to useState
 */
const useLocalStorage = (key, initialValue) => {
  // Create state based on value from localStorage or initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that 
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Update stored value if the key changes
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error updating from localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;