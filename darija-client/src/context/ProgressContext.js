import React from 'https://unpkg.com/react@18/esm/react.development.js';

// Default progress shape
const defaultProgress = {
  completedFlashcards: new Set(),
  quizScores: []
};

export const ProgressContext = React.createContext(defaultProgress);

export const useProgress = () => {
  const context = React.useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};