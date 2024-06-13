import React, { useState } from 'react';
import quizQuestionsData from './quizQuestions.json';
import './App.css'; // Import the CSS file


const QuizContainer = () => {
  const [quizQuestions, setQuizQuestions] = useState(quizQuestionsData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false); // New state for showing the result

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true); // Show the result when all questions are answered
    }
  };

  // Render the current question or the result
  const renderContent = () => {
    if (showResult) {
      return <Result score={score} totalQuestions={quizQuestions.length} />;
    } else {
      const question = quizQuestions[currentQuestion];
      return (
        <Question
          question={question.question}
          answers={question.answers}
          handleAnswerSelect={handleAnswerSelect}
        />
      );
    }
  };

  return <div className="quiz-container">{renderContent()}</div>;
};

// Question component
const Question = ({ question, answers, handleAnswerSelect }) => (
  <div className="question-container">
    <h2>{question}</h2>
    <div className="answer-options">
      {answers.map((answer) => (
        <button
          key={answer}
          onClick={() => handleAnswerSelect(answer)}
          className="answer-btn"
        >
          {answer}
        </button>
      ))}
    </div>
  </div>
);

// Result component
const Result = ({ score, totalQuestions }) => (
  <div className="result-container">
    <h2>Quiz Result</h2>
    <p>
      You scored {score} out of {totalQuestions}
    </p>
  </div>
);


const App = () => {
  const [category, setCategory] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizStarted, setQuizStarted] = useState(false);

  const handleStartQuiz = () => {
    // Filter the questions based on the selected category, number of questions, and difficulty
    const filteredQuestions = quizQuestionsData.filter(
      (question) =>
        (!category || question.category === category) &&
        question.difficulty === difficulty
    );
    const selectedQuestions = filteredQuestions.slice(0, numQuestions);
    setQuizStarted(true);
    // Pass the selectedQuestions to the QuizContainer component
  };

  return (
    <div className="app">
      <h1>Quiz App</h1>
      {!quizStarted && (
        <div className="quiz-options">
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="history">History</option>
              <option value="science">Science</option>
              <option value="geography">Geography</option>
              {/* Add more categories as needed */}
            </select>
          </label>
          <label>
            Number of Questions:
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min="1"
              max="20"
            />
          </label>
          <label>
            Difficulty:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      )}
      {quizStarted && <QuizContainer /* Pass the selectedQuestions prop */ />}
    </div>
  );
};

export default App;