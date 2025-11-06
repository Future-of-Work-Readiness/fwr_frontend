import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Plus, Edit2, Trash2, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

export default function GoalsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [goals, setGoals] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingJournal, setEditingJournal] = useState(null);
  
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: 'readiness',
    target_value: 0,
    target_date: ''
  });
  
  const [journalForm, setJournalForm] = useState({
    prompt: '',
    content: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    fetchData(parsed.id);
  }, [navigate]);

  const fetchData = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch readiness
      const readinessRes = await fetch(`http://localhost:8000/api/dashboard?user_id=${userId}`);
      if (readinessRes.ok) {
        const readinessData = await readinessRes.json();
        setReadiness(readinessData.readiness);
      }
      
      // Fetch goals
      const goalsRes = await fetch(`http://localhost:8000/api/goals?user_id=${userId}`);
      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData);
      }
      
      // Fetch journal entries
      const journalRes = await fetch(`http://localhost:8000/api/journal?user_id=${userId}&limit=10`);
      if (journalRes.ok) {
        const journalData = await journalRes.json();
        setJournalEntries(journalData);
      }
    } catch (e) {
      setError(e.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/goals?user_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...goalForm,
          target_date: goalForm.target_date || null
        })
      });
      if (res.ok) {
        await fetchData(user.id);
        setShowGoalForm(false);
        setGoalForm({ title: '', description: '', category: 'readiness', target_value: 0, target_date: '' });
      }
    } catch (e) {
      alert('Failed to create goal: ' + e.message);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/goals/${editingGoal.id}?user_id=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalForm)
      });
      if (res.ok) {
        await fetchData(user.id);
        setEditingGoal(null);
        setShowGoalForm(false);
        setGoalForm({ title: '', description: '', category: 'readiness', target_value: 0, target_date: '' });
      }
    } catch (e) {
      alert('Failed to update goal: ' + e.message);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/goals/${goalId}?user_id=${user.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchData(user.id);
      }
    } catch (e) {
      alert('Failed to delete goal: ' + e.message);
    }
  };

  const handleUpdateProgress = async (goalId, currentValue) => {
    try {
      const res = await fetch(`http://localhost:8000/api/goals/${goalId}/progress?user_id=${user.id}&current_value=${currentValue}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        await fetchData(user.id);
      }
    } catch (e) {
      alert('Failed to update progress: ' + e.message);
    }
  };

  const handleCreateJournal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/journal?user_id=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journalForm)
      });
      if (res.ok) {
        await fetchData(user.id);
        setShowJournalForm(false);
        setJournalForm({ prompt: '', content: '' });
      }
    } catch (e) {
      alert('Failed to create journal entry: ' + e.message);
    }
  };

  const handleDeleteJournal = async (entryId) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/journal/${entryId}?user_id=${user.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchData(user.id);
      }
    } catch (e) {
      alert('Failed to delete journal entry: ' + e.message);
    }
  };

  const startEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      target_value: goal.target_value,
      target_date: goal.target_date ? goal.target_date.split('T')[0] : ''
    });
    setShowGoalForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const currentReadiness = readiness || {
    overall: user.readiness_score || 0,
    technical: user.technical_score || 0,
    soft: user.soft_skills_score || 0
  };

  const getProgressPercentage = (goal) => {
    if (goal.target_value === 0) return 0;
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
  };

  const journalPrompts = [
    "What was my biggest challenge this week?",
    "What skill do I want to develop next?",
    "What progress have I made toward my goals?",
    "What obstacles am I facing?",
    "What am I grateful for in my learning journey?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Self-Reflection & Goals</h1>
            <p className="text-gray-600">Track your progress and reflect on your journey</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Where I Am Now */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Where I Am Now
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Overall Readiness</div>
                <div className="text-3xl font-bold text-blue-600">{Math.round(currentReadiness.overall)}%</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Technical Skills</div>
                <div className="text-3xl font-bold text-green-600">{Math.round(currentReadiness.technical)}%</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Soft Skills</div>
                <div className="text-3xl font-bold text-yellow-600">{Math.round(currentReadiness.soft)}%</div>
              </div>
            </div>
          </div>

          {/* Where I Want To Be */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              Where I Want To Be
            </h2>
            {!showGoalForm ? (
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setGoalForm({ title: '', description: '', category: 'readiness', target_value: 0, target_date: '' });
                  setShowGoalForm(true);
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex items-center justify-center gap-2 text-gray-600"
              >
                <Plus className="h-5 w-5" />
                Set a New Goal
              </button>
            ) : (
              <form onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal} className="space-y-4">
                <input
                  type="text"
                  placeholder="Goal Title"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="2"
                />
                <select
                  value={goalForm.category}
                  onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="readiness">Overall Readiness</option>
                  <option value="technical">Technical Skills</option>
                  <option value="soft_skills">Soft Skills</option>
                  <option value="leadership">Leadership</option>
                </select>
                <input
                  type="number"
                  placeholder="Target Value (%)"
                  value={goalForm.target_value}
                  onChange={(e) => setGoalForm({ ...goalForm, target_value: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
                <input
                  type="date"
                  value={goalForm.target_date}
                  onChange={(e) => setGoalForm({ ...goalForm, target_date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                  >
                    {editingGoal ? 'Update Goal' : 'Create Goal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoalForm(false);
                      setEditingGoal(null);
                    }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Goal Tracking Dashboard */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Goal Tracking Dashboard
          </h2>
          {goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No goals set yet. Create your first goal above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = getProgressPercentage(goal);
                return (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span className="capitalize">{goal.category.replace('_', ' ')}</span>
                          <span>Target: {goal.target_value}%</span>
                          {goal.target_date && (
                            <span>By: {new Date(goal.target_date).toLocaleDateString()}</span>
                          )}
                          {goal.is_completed && (
                            <span className="text-green-600 font-semibold">✓ Completed</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditGoal(goal)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress: {goal.current_value.toFixed(1)}% / {goal.target_value}%</span>
                        <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            goal.is_completed ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {!goal.is_completed && (
                        <div className="mt-2">
                          <input
                            type="number"
                            placeholder="Update progress"
                            min="0"
                            max={goal.target_value}
                            step="0.1"
                            className="w-32 p-1 border border-gray-300 rounded text-sm"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                  handleUpdateProgress(goal.id, value);
                                  e.target.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Self-Reflection Journal */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-indigo-600" />
              Self-Reflection Journal
            </h2>
            {!showJournalForm && (
              <button
                onClick={() => {
                  setEditingJournal(null);
                  setJournalForm({ prompt: '', content: '' });
                  setShowJournalForm(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Entry
              </button>
            )}
          </div>

          {showJournalForm && (
            <form onSubmit={handleCreateJournal} className="mb-6 space-y-4 border-b pb-6">
              <select
                value={journalForm.prompt}
                onChange={(e) => setJournalForm({ ...journalForm, prompt: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select a prompt (optional)</option>
                {journalPrompts.map((prompt, idx) => (
                  <option key={idx} value={prompt}>{prompt}</option>
                ))}
              </select>
              <textarea
                placeholder="Write your reflection here..."
                value={journalForm.content}
                onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="6"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowJournalForm(false);
                    setJournalForm({ prompt: '', content: '' });
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {journalEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No journal entries yet. Start reflecting on your journey!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  {entry.prompt && (
                    <div className="text-sm font-semibold text-indigo-600 mb-2">{entry.prompt}</div>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteJournal(entry.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

