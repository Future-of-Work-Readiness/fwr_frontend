import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, X } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { getTestById, calculateTestScore, saveTestResult } from '../utils/testSystem';

const TestTakingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizIdState, setQuizIdState] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    setUser(currentUser);
    
    // Get test ID from location state
    const testId = location.state?.testId;
    if (!testId) {
      navigate('/test-hub');
      return;
    }
    
    // Load the test from database API
    const loadTest = async () => {
      try {
        // Ensure testId is a number (may come as string from location.state)
        const quizId = typeof testId === 'string' ? parseInt(testId) : testId;
        
        if (!quizId || isNaN(quizId)) {
          throw new Error(`Invalid quiz ID: ${testId}`);
        }
        
        console.log(`Loading quiz with ID: ${quizId}`);
        const response = await fetch(`http://localhost:8000/api/quizzes/${quizId}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API Error: ${response.status} - ${errorText}`);
          throw new Error(`Failed to fetch quiz: ${response.status} ${errorText}`);
        }
        
        const quizData = await response.json();
        console.log('Quiz data loaded:', quizData);
        
        // Transform database format to frontend format
        const transformedTest = {
          id: quizData.id.toString(),
          title: quizData.title,
          description: quizData.description,
          estimatedTime: quizData.duration || 30,
          questions: (quizData.questions || []).map((q, idx) => {
            // Extract option texts and find correct index
            const optionTexts = q.options ? 
              (q.options.map ? q.options.map(opt => typeof opt === 'string' ? opt : opt.text) : q.options) : [];
            const correctIndex = q.correct_index !== undefined ? q.correct_index :
              (q.options && q.options.findIndex ? q.options.findIndex(opt => 
                (typeof opt === 'object' && opt.is_correct)) : null);
            
            return {
              id: q.id || idx + 1,
              type: 'multiple-choice',
              question: q.question,
              options: optionTexts,
              correct: correctIndex,
              explanation: q.explanation
            };
          })
        };
        
        setTest(transformedTest);
        setQuizIdState(quizId);
        setTimeLeft(transformedTest.estimatedTime * 60);
        setStartTime(Date.now());
        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz from API:', error);
        // Show detailed error message
        const errorMessage = error.message || 'Failed to load quiz. Please ensure the backend is running.';
        alert(`Error: ${errorMessage}\n\nCheck browser console for details.`);
        navigate('/test-hub');
      }
    };
    
    loadTest();
  }, [navigate, location.state]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && test && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && test && !isSubmitted) {
      // Auto submit when time runs out
      handleSubmit(true);
    }
  }, [timeLeft, test, isSubmitted]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitted) return;

    try {
      setIsSubmitted(true);
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
      
      // Try to submit to backend API
      let backendResult = null;
      let score = 0;
      let correctCount = 0;
      let createdAttemptId = null;
      
      try {
        // Start quiz attempt - backend expects user_id as query parameter
        const quizIdForSubmit = quizIdState ?? (test && test.id ? parseInt(test.id) : null);
        if (!quizIdForSubmit || isNaN(quizIdForSubmit)) {
          throw new Error(`Cannot determine quiz ID for submission`);
        }
        const startResponse = await fetch(`http://localhost:8000/api/quizzes/${quizIdForSubmit}/start?user_id=${user.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (startResponse.ok) {
          const startData = await startResponse.json();
          const attemptId = startData.attempt_id;
          createdAttemptId = attemptId;
          
          // Prepare answers for submission
          const submissionAnswers = test.questions.map((q, idx) => {
            const userAnswerIndex = answers[q.id];
            const selectedOption = q.options[userAnswerIndex];
            return {
              question_id: q.id,
              selected_answer: selectedOption || ""
            };
          });
          
          // Submit quiz answers - backend endpoint: /api/attempts/{attempt_id}/submit
          const submitResponse = await fetch(`http://localhost:8000/api/attempts/${attemptId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: submissionAnswers })
          });
          
          if (submitResponse.ok) {
            backendResult = await submitResponse.json();
            score = backendResult.score || 0;
            correctCount = backendResult.correct || 0;
            console.log('Quiz submitted successfully to backend:', backendResult);
            // Update local currentUser with backend readiness snapshot if present
            try {
              if (backendResult.readiness) {
                const userRaw = localStorage.getItem('currentUser');
                if (userRaw) {
                  const u = JSON.parse(userRaw);
                  if (u && u.id === user.id) {
                    // Use camelCase for consistency with Dashboard
                    u.readinessScore = Math.round(backendResult.readiness.overall);
                    u.technicalScore = Math.round(backendResult.readiness.technical);
                    u.softSkillsScore = Math.round(backendResult.readiness.soft);
                    // Also update snake_case for backend compatibility
                    u.readiness_score = Math.round(backendResult.readiness.overall);
                    u.technical_score = Math.round(backendResult.readiness.technical);
                    u.soft_skills_score = Math.round(backendResult.readiness.soft);
                    localStorage.setItem('currentUser', JSON.stringify(u));
                  }
                }
              }
            } catch {}
          }
        }
      } catch (backendError) {
        console.warn('Backend submission failed, using local calculation:', backendError);
      }
      
      // Fallback to local calculation if backend submission failed
      if (!backendResult) {
        const correctAnswers = test.questions.map(q => q.correct);
        const userAnswers = test.questions.map(q => answers[q.id] ?? null);
        score = calculateTestScore(userAnswers, correctAnswers);
        correctCount = userAnswers.filter((ans, idx) => ans === correctAnswers[idx]).length;
      }
      
      // Save result locally as backup
      const localResult = saveTestResult(user.id, test.id, score, answers, timeSpent);
      
      // Navigate to results
      navigate('/test-results', {
        state: {
          test,
          answers,
          score,
          correct: correctCount,
          total: test.questions.length,
          timeSpent,
          result: backendResult || localResult,
          backendResult: backendResult,  // Pass the full backend response with feedback
          autoSubmit,
          passed: score >= 70,
          attemptId: createdAttemptId
        }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Still navigate to results even if submission fails
      const correctAnswers = test.questions.map(q => q.correct);
      const userAnswers = test.questions.map(q => answers[q.id] ?? null);
      const score = calculateTestScore(userAnswers, correctAnswers);
      const result = saveTestResult(user.id, test.id, score, answers, timeSpent);
      
      navigate('/test-results', {
        state: {
          test,
          answers,
          score,
          timeSpent,
          result,
          autoSubmit
        }
      });
    }
  };

  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    navigate('/test-hub');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const answered = Object.keys(answers).length;
    return (answered / test.questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Test Not Found</h2>
          <p className="text-gray-600 mb-4">The requested test could not be loaded.</p>
          <button
            onClick={() => navigate('/test-hub')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Test Hub
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleExit}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{test.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {Object.keys(answers).length}/{test.questions.length}
              </span>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className={`text-sm font-mono ${
                timeLeft < 300 ? 'text-red-600' : 'text-gray-700'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white">
          {/* Question */}
          <div className="mb-8">
            {currentQuestion.scenario && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Scenario:</h3>
                <p className="text-blue-800">{currentQuestion.scenario}</p>
              </div>
            )}
            
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>
            
            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(currentQuestion.id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </button>
                ))
              )}
              
              {currentQuestion.type === 'true-false' && (
                <>
                  <button
                    onClick={() => handleAnswer(currentQuestion.id, true)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === true
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === true
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion.id] === true && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-gray-900">True</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleAnswer(currentQuestion.id, false)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === false
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === false
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion.id] === false && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="text-gray-900">False</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-4">
              {isLastQuestion ? (
                <button
                  onClick={() => handleSubmit()}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exit Test?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to exit? Your progress will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Exit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestTakingPage;
