import React from 'https://unpkg.com/react@18/esm/react.development.js';
import ReactDOM from 'https://unpkg.com/react-dom@18/esm/react-dom.development.js';
import { FlashcardCarousel } from './components/FlashcardCarousel.js';
import { Quiz } from './components/Quiz.js';
import { ProgressDashboard } from './components/ProgressDashboard.js';
import { ProgressContext } from './context/ProgressContext.js';
import { getDarijaData, loadProgress, saveProgress } from './api.js';

function App() {
  const [progress, setProgress] = React.useState({
    completedFlashcards: new Set(),
    quizScores: []
  });
  const [darijaData, setDarijaData] = React.useState([]);

  // Load initial data and progress from mock API
  React.useEffect(() => {
    const init = async () => {
      const data = await getDarijaData();
      setDarijaData(data);
      const savedProgress = await loadProgress();
      setProgress(savedProgress);
    };
    init();
  }, []);

  const handleSaveProgress = async (updatedProgress) => {
    const saved = await saveProgress(updatedProgress);
    setProgress(saved);
  };

  // Provide darijaData to components via context or props; we'll use a simple approach:
  // we'll create a DataContext or just pass as prop to components that need it.
  // For simplicity, we'll attach to window for components to access (not ideal but works).
  // Better: create a DataContext.
  // Let's create a simple context for data.
  // However to avoid major changes, we'll keep the import in components and rely on the fact that
  // the data is already imported in those components. Since we are not changing the data,
  // we can keep the import as is. The API is just for demonstration.
  // We'll keep the existing imports in components.

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      <div>
        <header>
          <h1>Darija Guide</h1>
        </header>
        <main>
          {window.location.hash === '#quiz' ? (
            <Quiz onSaveProgress={handleSaveProgress} />
          ) : window.location.hash === '#progress' ? (
            <ProgressDashboard />
          ) : (
            <FlashcardCarousel onSaveProgress={handleSaveProgress} />
          )}
        </main>
      </div>
    </ProgressContext.Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));