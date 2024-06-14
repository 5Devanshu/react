import React, { useState, useEffect } from 'react';
import quizQuestionsData from './quizQuestions.json';
import './App.css'; // Import the CSS file
import Navbar from './components/Navbar';

const QuizContainer = ({ selectedQuestions }) => {
  const [quizQuestions, setQuizQuestions] = useState(selectedQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Timer logic
  useEffect(() => {
    let timer;
    if (timerRunning) {
      timer = setTimeout(() => {
        setTimeElapsed(timeElapsed + 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [timeElapsed, timerRunning]);

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
      setTimerRunning(false); // Stop the timer
    }
  };

  // Render the current question or the result
  const renderContent = () => {
    if (showResult) {
      return <Result score={score} totalQuestions={quizQuestions.length} timeElapsed={timeElapsed} />;
    } else {
      const question = quizQuestions[currentQuestion];
      return (
        <>
          <Question
            question={question.question}
            answers={question.answers}
            handleAnswerSelect={handleAnswerSelect}
          />
        </>
      );
    }
  };

  return (
    <div className="quiz-container">
      <Timer timeElapsed={timeElapsed} />
      {renderContent()}
    </div>
  );
};

// Timer component
const Timer = ({ timeElapsed }) => (
  <div className="timer-card">
    <h3>Time Taken: {formatTime(timeElapsed)}</h3>
  </div>
);

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
const Result = ({ score, totalQuestions, timeElapsed }) => (
  <div className="result-container">
    <h2>Quiz Result</h2>
    <p>
      You scored {score} out of {totalQuestions} questions.
    </p>
    {/* <p>
      Time taken: {formatTime(timeElapsed)}
    </p> */}
  </div>
);

// Utility function to format time in MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const App = () => {
  const [category, setCategory] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [numQuestionsDisplay, setNumQuestionsDisplay] = useState(10); // New state variable

  const filterQuestionsByCategory = (category) => {
    if (category === '') {
      return quizQuestionsData;
    } else {
      return quizQuestionsData.filter((question) => question.category === category);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleStartQuiz = () => {
    let filteredQuestions;
  
    if (category === '') {
      // If "All" is selected, get all questions and shuffle them randomly
      filteredQuestions = shuffleArray(quizQuestionsData);
    } else {
      // Filter the questions based on the selected category
      filteredQuestions = filterQuestionsByCategory(category);
    }
  
    // Further filter the questions based on difficulty and number of questions
    const questions = filteredQuestions
      .filter((question) => question.difficulty === difficulty)
      .slice(0, numQuestions);
  
    setSelectedQuestions(questions);
    setQuizStarted(true);
  };

  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value);
    setNumQuestions(value);
    setNumQuestionsDisplay(value); // Update the numQuestionsDisplay state
  };

  return (
    <>
    <Navbar />
    <div className="app">
     
      <h1>Quiz App</h1>
      {!quizStarted && (
        <div className="quiz-options">
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>All</option>
              <option value="history">History</option>
              <option value="science">Science</option>
              <option value="geography">Geography</option>
            </select>
          </label>
          <label>
            Number of Questions: {numQuestionsDisplay} {/* Display the numQuestionsDisplay value */}
            <input
              type="number"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              min="1"
              max="20"
            />
          </label>
          <label>
            Difficulty:
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      )}
      {quizStarted && <QuizContainer selectedQuestions={selectedQuestions} />}
    </div>
    </>
  );
};

export default App;
