import React, { useState, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './QuizApp.scss';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const QuizApp: React.FC = () => {
  const [questions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      category: "Geography"
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      category: "Science"
    },
    {
      id: 3,
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      category: "Math"
    },
    {
      id: 4,
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correctAnswer: 2,
      category: "Art"
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: 3,
      category: "Geography"
    }
  ]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResult) {
      handleNext();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResult]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! 🎉";
    if (percentage >= 60) return "Good job! 👍";
    if (percentage >= 40) return "Not bad! 👌";
    return "Keep trying! 💪";
  };

  if (!quizStarted) {
    return (
      <div className="quiz-app">
        <BackButton />
        <div className="quiz-container">
          <div className="welcome-screen">
            <h1 className="quiz-title">🧠 Knowledge Quiz</h1>
            <p className="quiz-description">
              Test your knowledge with our interactive quiz!
              <br />
              You have 30 seconds per question.
            </p>
            <div className="quiz-stats">
              <div className="stat-item">
                <span className="stat-number">{questions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">30s</span>
                <span className="stat-label">Per Question</span>
              </div>
            </div>
            <button onClick={startQuiz} className="start-btn">
              Start Quiz 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="quiz-app">
        <div className="quiz-container">
          <div className="result-screen">
            <h1 className="result-title">Quiz Complete!</h1>
            <div className="score-circle">
              <span className="score-text">{score}/{questions.length}</span>
            </div>
            <h2 className="score-message">{getScoreMessage()}</h2>
            <div className="score-percentage">
              {Math.round((score / questions.length) * 100)}% Correct
            </div>
            <div className="result-actions">
              <button onClick={resetQuiz} className="retry-btn">
                Try Again 🔄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-app">
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="quiz-info">
            <span className="question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="timer">
              <span className="timer-text">⏰ {timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="question-section">
          <div className="category-tag">
            {questions[currentQuestion].category}
          </div>
          <h2 className="question-text">
            {questions[currentQuestion].question}
          </h2>
        </div>

        <div className="options-section">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        <div className="quiz-actions">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="next-btn"
          >
            {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
