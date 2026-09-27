import React from 'https://unpkg.com/react@18/esm/react.development.js';
import { useContext } from 'https://unpkg.com/react@18/esm/react.development.js';
import { ProgressContext } from '../context/ProgressContext.js';
import { DARIJA_DATA } from '../data/darija.js';

export const ProgressDashboard = () => {
  const { progress } = useContext(ProgressContext);
  const completedCount = progress.completedFlashcards.size;
  const totalItems = DARIJA_DATA.length;
  const quizScores = progress.quizScores || [];

  return (
    <div className="progress-dashboard">
      <h2>Your Progress</h2>
      <div className="stats">
        <p>
          <strong>Flashcards learned:</strong> {completedCount} / {totalItems}
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(completedCount / totalItems) * 100}%` }}></div>
        </div>
      </div>

      {completedCount > 0 && (
        <div>
          <h3>Learned Words</h3>
          <ul>
            {DARIJA_DATA
              .filter((item) => progress.completedFlashcards.has(item.id))
              .map((item) => (
                <li key={item.id}>
                  <strong>{item.arabic}</strong> ({item.transliteration}) – {item.english}
                </li>
              ))}
          </ul>
        </div>
      )}

      {quizScores.length > 0 && (
        <div>
          <h3>Quiz History</h3>
          <ul>
            {quizScores.map((score, idx) => (
              <li key={idx}>
                {new Date(score.date).toLocaleString()}: {score.score}/{score.total}
              </li>
            ))}
          </ul>
        </div>
      )}

      {completedCount === 0 && quizScores.length === 0 && (
        <p>No progress yet. Start learning with flashcards or take a quiz!</p>
      )}
    </div>
  );
};