import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TutorialContext = createContext();

const TUTORIAL_KEY = 'showTutorial';

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(true); 

  useEffect(() => {
    const getTutorialValue = async () => {
        try {
          const storedValue = await AsyncStorage.getItem(TUTORIAL_KEY);
          if (storedValue) {
              setShowTutorial(storedValue);
          } 
          
        } catch (error) {
          console.error('Failed to load tutorial:', error);
        }
    }
    getTutorialValue();
  }, []);

  const removeTutorialValue = async () => {
    try {
        await AsyncStorage.setItem(TUTORIAL_KEY, 'false');
        setShowTutorial(false);
    } catch (error) {
        console.error('Failed to remove tutorial:', error);
    }
  }

  const setTutorialValue = async () => {
    try {
        await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
        setShowTutorial(true);
        return true;
      } catch (error) {
        console.error('Failed to set tutorial:', error);
      }
  }

  return (
    <TutorialContext.Provider value={{ showTutorial, removeTutorialValue, setTutorialValue}}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};


