import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  Target,
  BarChart3
} from 'lucide-react';

export default function PeerBenchmarkingPage() {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadBenchmarkData();
  }, []);

  const loadBenchmarkData = async () => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      navigate('/');
      return;
    }

    const currentUser = JSON.parse(userStr);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/users/${currentUser.id}/peer-benchmark`);
      const result = await response.json();

      if (response.ok && result.success) {
        setBenchmarkData(result.data);
      } else {
        setError(result.detail || 'Failed to load peer benchmarking data');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    if (status === 'above') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (status === 'below') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'above') return 'bg-green-50 border-green-200';
    if (status === 'below') return 'bg-red-50 border-red-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getStatusText = (status, difference) => {
    if (status === 'above') return `${Math.abs(difference).toFixed(1)} points above average`;
    if (status === 'below') return `${Math.abs(difference).toFixed(1)} points below average`;
    return 'At average level';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peer comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Not Enough Data</h3>
                <p className="text-yellow-800">{error}</p>
                <p className="text-yellow-700 mt-2">
                  Complete more quizzes and encourage others in your specialization to join!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!benchmarkData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Peer Benchmarking</h1>
              <p className="text-gray-600">
                Compare your performance with {benchmarkData.total_peers} peers in{' '}
                <span className="font-semibold">{benchmarkData.specialization_name}</span>
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-gray-500">
              <Users className="w-5 h-5" />
              <span className="text-sm">
                Last updated: {new Date(benchmarkData.last_updated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Overall Percentile Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Your Overall Standing</p>
              <h2 className="text-4xl font-bold mb-2">
                Top {100 - benchmarkData.overall_percentile}%
              </h2>
              <p className="text-blue-100">
                You score higher than <span className="font-semibold">{benchmarkData.overall_percentile}%</span> of your peers
              </p>
            </div>
            <Award className="w-16 h-16 text-white/30" />
          </div>
        </div>

        {/* Score Comparisons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {benchmarkData.comparisons.map((comparison, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-6 border-2 ${getStatusColor(comparison.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {comparison.category}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getStatusText(comparison.status, comparison.difference)}
                  </p>
                </div>
                {getStatusIcon(comparison.status)}
              </div>

              <div className="space-y-4">
                {/* Your Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Score</span>
                    <span className="text-lg font-bold text-blue-600">
                      {comparison.your_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${comparison.your_score}%` }}
                    />
                  </div>
                </div>

                {/* Peer Average */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Peer Average</span>
                    <span className="text-lg font-bold text-gray-600">
                      {comparison.peer_average}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${comparison.peer_average}%` }}
                    />
                  </div>
                </div>

                {/* Percentile */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your Percentile</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {comparison.percentile}th percentile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Common Strengths and Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Common Strengths */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-slate-800">Common Strengths</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Areas where most peers in your specialization excel
            </p>
            {benchmarkData.common_strengths.length > 0 ? (
              <div className="space-y-3">
                {benchmarkData.common_strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-green-900">{strength.area}</h4>
                      <span className="text-lg font-bold text-green-600">
                        {strength.percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-green-800">{strength.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No common strengths identified yet.</p>
            )}
          </div>

          {/* Common Gaps */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-slate-800">Common Gaps</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Areas where most peers need improvement
            </p>
            {benchmarkData.common_gaps.length > 0 ? (
              <div className="space-y-3">
                {benchmarkData.common_gaps.map((gap, index) => (
                  <div
                    key={index}
                    className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-orange-900">{gap.area}</h4>
                      <span className="text-lg font-bold text-orange-600">
                        {gap.percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-orange-800">{gap.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No common gaps identified yet.</p>
            )}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Privacy & Data</h4>
              <p className="text-sm text-blue-800">
                All peer comparison data is aggregated and anonymized. Your individual performance
                is never shared with other users. Benchmarks are updated regularly based on the
                latest quiz attempts from all users in your specialization.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/test-hub')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Take More Quizzes to Improve Your Ranking</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
