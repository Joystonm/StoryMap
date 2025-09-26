import React, { useState } from 'react';

const IndigenousQuiz = ({ questions = [], location, onRegenerateQuiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (questions[currentQuestion]?.correctAnswer === answerIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
        <div className="text-4xl mb-4">🪃</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Quiz Available</h3>
        <p className="text-gray-500">Please select a location to generate quiz questions.</p>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Quiz Complete! 🎉</h3>
          <p className="text-green-100">Your knowledge of {location?.name} Indigenous culture</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="text-6xl font-bold text-green-600 mb-4">
            {score}/{questions.length}
          </div>
          <div className="text-2xl font-semibold text-gray-700 mb-2">
            {percentage}% Correct
          </div>
          <p className="text-gray-600 mb-8">
            {percentage >= 80 ? '🌟 Excellent! You have great knowledge of Indigenous culture!' :
             percentage >= 60 ? '👍 Good job! Keep learning about Indigenous heritage!' :
             '📚 Great start! There\'s so much more to discover!'}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              🔄 Retake Quiz
            </button>
            <button
              onClick={onRegenerateQuiz}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              ✨ Try Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">Indigenous Knowledge Quiz</h3>
          <span className="text-orange-100 text-sm bg-white/20 px-3 py-1 rounded-full">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-orange-400 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        {location && (
          <p className="text-orange-100 text-sm mt-2">📍 {location.name}</p>
        )}
      </div>

      {/* Question */}
      <div className="p-8">
        <h4 className="text-xl font-semibold mb-6 text-gray-800 leading-relaxed">
          {question.question}
        </h4>
        
        {/* Answer Options */}
        <div className="space-y-4 mb-6">
          {question.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                showFeedback
                  ? selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 text-green-800 shadow-lg'
                      : 'bg-red-100 border-red-500 text-red-800 shadow-lg'
                    : index === question.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800 shadow-lg'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  : 'hover:bg-orange-50 border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold ${
                  showFeedback && selectedAnswer === index
                    ? isCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-red-500 bg-red-500 text-white'
                    : showFeedback && index === question.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-current'
                }`}>
                  {showFeedback && selectedAnswer === index
                    ? isCorrect ? '✓' : '✗'
                    : showFeedback && index === question.correctAnswer
                      ? '✓'
                      : String.fromCharCode(65 + index)
                  }
                </span>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-xl mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {isCorrect ? '🎉' : '📚'}
              </span>
              <div>
                <h5 className={`font-semibold mb-2 ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </h5>
                <p className={`text-sm ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {question.explanation || (isCorrect 
                    ? 'Great job! You have good knowledge of Indigenous culture.'
                    : `The correct answer is: ${question.options[question.correctAnswer]}`
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        {showFeedback && (
          <div className="text-center">
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-medium shadow-lg transform hover:scale-105"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Quiz 🎉'}
            </button>
          </div>
        )}

        {/* Regenerate Button */}
        {!showFeedback && (
          <div className="text-center mt-6">
            <button
              onClick={onRegenerateQuiz}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors"
            >
              ✨ Generate New Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndigenousQuiz;
