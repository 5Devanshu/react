import React , { useState } from 'react';

const Quiz = ({ quiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState(Array(quiz.questions.length).fill(null));

  const handleNext = () => {
    if (userResponses[questionIndex] !== null) {
      setQuestionIndex(questionIndex + 1);
      changeBackgroundColor();
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      changeBackgroundColor();
    }
  };

  const handleSelectOption = (index) => {
    const newResponses = [...userResponses];
    newResponses[questionIndex] = index;
    setUserResponses(newResponses);
  };

  const score = () => {
    return userResponses.reduce((score, response, index) => {
      return response !== null && quiz.questions[index].responses[response].correct
        ? score + 1
        : score;
    }, 0);
  };

  const restart = () => {
    setQuestionIndex(0);
    setUserResponses(Array(quiz.questions.length).fill(null));
    changeBackgroundColor();
  };

  const progress = ((questionIndex / quiz.questions.length) * 100).toFixed(2);

  const charIndex = (i) => String.fromCharCode(65 + i);

  const changeBackgroundColor = () => {
    const colors = ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  };

  // Render your Quiz component here
  // You can use conditional rendering to display different sections based on `questionIndex`
  // and use JSX to structure your HTML output
};

export default Quiz;