import React from 'https://unpkg.com/react@18/esm/react.development.js';
import { DARIJA_DATA } from '../data/darija.js';
import { useContext } from 'https://unpkg.com/react@18/esm/react.development.js';
import { ProgressContext } from '../context/ProgressContext.js';

export const Quiz = ({ onSaveProgress }) => {
  const { progress, setProgress } = useContext(ProgressContext);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(null);
  const [quizScores, setQuizScores] = React.useState(progress.quizScores || []);

  const loadQuestion = () => {
    const item = DARIJA_DATA[questionIndex];
    // Generate options: correct transliteration + 3 random wrong ones
    const correct = item.transliteration;
    const wrong = DARIJA_DATA
      .filter((_, i) => i !== questionIndex)
      .map((x) => x.transliteration)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const all = [...wrong, correct].sort(() => 0.5 - Math.random());
    setOptions(all);
    setSelected(null);
    setShowFeedback(false);
    setIsCorrect(null);
  };

  React.useEffect(() => {
    loadQuestion();
  }, [questionIndex]);

  const handleSelect = (option) => {
    setSelected(option);
    setShowFeedback(true);
    setIsCorrect(option === DARIJA_DATA[questionIndex].transliteration);
  };

  const handleNext = () => {
    if (questionIndex < DARIJA_DATA.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      // Quiz finished, calculate score
      const score = quizScores.filter((s) => s.correct).length;
      setQuizScores([
        ...quizScores,
        { date: new Date().toISOString(), score, total: DARIJA_DATA.length }
      ]);
      setProgress({
        ...progress,
        quizScores: [...quizScores, { date: new Date().toISOString(), score, total: DARIJA_DATA.length }]
      });
      onSaveProgress({
        ...progress,
        quizScores: [...quizScores, { date: new Date().toISOString(), score, total: DARIJA_DATA.length }]
      });
      // Optionally reset quiz
      setQuestionIndex(0);
    }
  };

  return (
    <div className="quiz-container">
      <h2>Quiz: Transliteration</h2>
      {DARIJA_DATA[questionIndex] && (
        <div>
          <p className="question">How do you say "{DARIJA_DATA[questionIndex].arabic}" in Latin letters?</p>
          <div className="options">
            {options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-button ${showFeedback && (opt === selected ? (isCorrect ? 'correct' : 'incorrect') : '')}`}
                onClick={() => handleSelect(opt)}
                disabled={showFeedback}
              >
                {opt}
              </button>
            ))}
          </div>
          {showFeedback && (
            <div style={{ marginTop: '20px' }}>
              {isCorrect ? (
                <p style={{ color: '#4caf50' }}>Correct! ✅</p>
              ) : (
                <p style={{ color: '#f44336' }}>Incorrect. The correct answer is "{DARIJA_DATA[questionIndex].transliteration}".</p>
              )}
            </div>
          )}
          {!showFeedback && (
            <button onClick={handleNext} disabled>{selected === null ? 'Select an answer' : 'Submit'}</button>
          )}
          {showFeedback && questionIndex < DARIJA_DATA.length - 1 && (
            <button onClick={handleNext} style={{ marginTop: '20px' }}>
              Next Question
            </button>
          )}
          {showFeedback && questionIndex === DARIJA_DATA.length - 1 && (
            <button onClick={handleNext} style={{ marginTop: '20px' }}>
              Finish Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
};