import React from 'https://unpkg.com/react@18/esm/react.development.js';
import { DARIJA_DATA } from '../data/darija.js';
import { useContext } from 'https://unpkg.com/react@18/esm/react.development.js';
import { ProgressContext } from '../context/ProgressContext.js';

export const FlashcardCarousel = ({ onSaveProgress }) => {
  const { progress, setProgress } = useContext(ProgressContext);
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [completed, setCompleted] = React.useState(new Set(progress.completedFlashcards));

  const item = DARIJA_DATA[index];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handlePlayAudio = () => {
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audio.play().catch(e => console.warn('Audio play failed', e));
    }
  };

  const handleNext = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % DARIJA_DATA.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + DARIJA_DATA.length) % DARIJA_DATA.length);
  };

  const handleMarkComplete = () => {
    const newCompleted = new Set(completed);
    newCompleted.add(item.id);
    setCompleted(newCompleted);
    setProgress({
      ...progress,
      completedFlashcards: newCompleted
    });
    onSaveProgress({
      ...progress,
      completedFlashcards: newCompleted
    });
  };

  return (
    <div className="flashcard-carousel">
      <div className="flashcard" onClick={handleFlip}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div>
              <h2>{item.arabic}</h2>
              <p className="transliteration">{item.transliteration}</p>
              <button onClick={handlePlayAudio} style={{ marginTop: '10px' }}>
                ▶️ Play
              </button>
            </div>
          </div>
          <div className="flashcard-back">
            <div>
              <p>{item.english}</p>
              {completed.has(item.id) ? (
                <span style={{ color: '#4caf50' }}>✓ Learned</span>
              ) : (
                <button onClick={handleMarkComplete} style={{ marginTop: '10px' }}>
                  Mark as Learned
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="controls">
        <button onClick={handlePrev} disabled={index === 0 && !flipped}>
          ‹ Prev
        </button>
        <span>
          {index + 1} of {DARIJA_DATA.length}
        </span>
        <button onClick={handleNext} disabled={index === DARIJA_DATA.length - 1 && !flipped}>
          Next ›
        </button>
      </div>
    </div>
  );
};