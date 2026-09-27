const DARIJA_DATA_KEY = 'darija-data';
const PROGRESS_KEY = 'darija-progress';

// Mock API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDarijaData = async () => {
  // In a real app, this would fetch from backend
  // For now, we import the static data
  // eslint-disable-next-line no-undef
  if (typeof DARIJA_DATA !== 'undefined') {
    await delay(300);
    return DARIJA_DATA;
  }
  // Fallback: try to load from localStorage (if we ever store it there)
  const stored = localStorage.getItem(DARIJA_DATA_KEY);
  if (stored) {
    await delay(300);
    return JSON.parse(stored);
  }
  await delay(300);
  return [];
};

export const saveProgress = async (progress) => {
  // Convert Set to array for storage
  const serializable = {
    ...progress,
    completedFlashcards: Array.from(progress.completedFlashcards)
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(serializable));
  await delay(300);
  return serializable;
};

export const loadProgress = async () => {
  const stored = localStorage.getItem(PROGRESS_KEY);
  if (stored) {
    await delay(300);
    const parsed = JSON.parse(stored);
    // Convert completedFlashcards back to Set
    return {
      ...parsed,
      completedFlashcards: new Set(parsed.completedFlashcards || [])
    };
  }
  await delay(300);
  return {
    completedFlashcards: new Set(),
    quizScores: []
  };
};