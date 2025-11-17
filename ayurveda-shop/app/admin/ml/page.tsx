'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Zap, Target, Play, Activity } from 'lucide-react';
import mlApi from '@/lib/api/ml';
import { toast } from 'sonner';

export default function MLPage() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'forecast' | 'anomalies' | 'playground' | 'models'>('recommendations');
  const [loading, setLoading] = useState(false);
  const [mlServiceHealth, setMlServiceHealth] = useState<boolean | null>(null);

  // Data states
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [modelsInfo, setModelsInfo] = useState<any>(null);
  const [playgroundOutput, setPlaygroundOutput] = useState<any>(null);

  // Playground input
  const [playgroundInput, setPlaygroundInput] = useState({
    orderHistory: 5,
    totalSpent: 10000,
    daysSinceLastOrder: 30,
    avgOrderValue: 2000,
    categoryPreference: 'Immunity Boosters',
  });

  useEffect(() => {
    checkMLServiceHealth();
    loadModelsInfo();
  }, []);

  const checkMLServiceHealth = async () => {
    try {
      const health = await mlApi.healthCheck();
      setMlServiceHealth(health.status === 'healthy');
      if (health.status === 'healthy') {
        toast.success('ML Service Connected', {
          description: `Version: ${health.version}`
        });
      }
    } catch (error) {
      setMlServiceHealth(false);
      console.error('ML service health check failed:', error);
    }
  };

  const loadModelsInfo = async () => {
    try {
      const info = await mlApi.getModelsInfo();
      setModelsInfo(info);
    } catch (error) {
      console.error('Failed to load models info:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await mlApi.getRecommendations('customer123', 5);
      setRecommendations(data.recommendations);
      toast.success('Recommendations loaded');
    } catch (error: any) {
      toast.error('Failed to load recommendations', {
        description: error.message || 'ML service may not be running'
      });
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const data = await mlApi.getDemandForecast('product456', 30);
      setForecasts(data);
      toast.success('Forecast generated');
    } catch (error: any) {
      toast.error('Failed to generate forecast', {
        description: error.message
      });
      setForecasts(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      const data = await mlApi.getAnomalies('revenue');
      setAnomalies(data.anomalies);
      toast.success('Anomalies detected');
    } catch (error: any) {
      toast.error('Failed to detect anomalies', {
        description: error.message
      });
      setAnomalies([]);
    } finally {
      setLoading(false);
    }
  };

  const runPlayground = async () => {
    try {
      setLoading(true);
      const result = await mlApi.runPlayground(playgroundInput);
      setPlaygroundOutput(result);
      toast.success('Predictions generated');
    } catch (error: any) {
      toast.error('Prediction failed', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (mlServiceHealth === false) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
              ML Service Not Available
            </h3>
          </div>
          <p className="text-yellow-800 dark:text-yellow-200 mb-4">
            The ML service is not running. Please start it to use ML features.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded p-4 font-mono text-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-2">To start the ML service:</p>
            <code className="block text-green-600 dark:text-green-400">
              start-ml-service.bat
            </code>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
              OR: cd ml-service && python app.py
            </p>
          </div>
          <button
            onClick={checkMLServiceHealth}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'recommendations':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Product Recommendations
              </h2>
              <button
                onClick={fetchRecommendations}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Generate Recommendations'}
              </button>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Click "Generate Recommendations" to see ML-powered product suggestions
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{rec.name}</h3>
                      <span className="text-sm font-medium text-green-600">
                        {(rec.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'forecast':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Demand Forecast
              </h2>
              <button
                onClick={fetchForecast}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Forecast'}
              </button>
            </div>

            {!forecasts ? (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Click "Generate Forecast" to see demand predictions
                </p>
              </div>
            ) : (
              <div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Product ID</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {forecasts.productId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Model</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {forecasts.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
                      <p className="text-lg font-semibold text-green-600">
                        {(forecasts.accuracy * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Forecasts</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {forecasts.forecasts?.length || 0} days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Predicted</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Lower</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Upper</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {forecasts.forecasts?.slice(0, 10).map((f: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {new Date(f.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                            {f.predicted.toFixed(0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {f.lower.toFixed(0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {f.upper.toFixed(0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-green-600">
                            {(f.confidence * 100).toFixed(0)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'anomalies':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Anomaly Detection
              </h2>
              <button
                onClick={fetchAnomalies}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Detecting...' : 'Detect Anomalies'}
              </button>
            </div>

            {anomalies.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Click "Detect Anomalies" to find unusual patterns
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {anomalies.map((anomaly, idx) => (
                  <div
                    key={idx}
                    className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 ${
                      anomaly.severity === 'high'
                        ? 'border-red-500'
                        : anomaly.severity === 'medium'
                        ? 'border-yellow-500'
                        : 'border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {anomaly.metric} Anomaly
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              anomaly.severity === 'high'
                                ? 'bg-red-100 text-red-800'
                                : anomaly.severity === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {anomaly.severity}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{anomaly.reason}</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Expected</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              ₹{anomaly.expected.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Actual</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              ₹{anomaly.actual.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Anomaly Score</p>
                            <p className="text-lg font-semibold text-red-600">
                              {(anomaly.anomaly_score * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'playground':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Model Playground
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Customer Input
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Order History
                    </label>
                    <input
                      type="number"
                      value={playgroundInput.orderHistory}
                      onChange={(e) =>
                        setPlaygroundInput({ ...playgroundInput, orderHistory: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Spent (₹)
                    </label>
                    <input
                      type="number"
                      value={playgroundInput.totalSpent}
                      onChange={(e) =>
                        setPlaygroundInput({ ...playgroundInput, totalSpent: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Days Since Last Order
                    </label>
                    <input
                      type="number"
                      value={playgroundInput.daysSinceLastOrder}
                      onChange={(e) =>
                        setPlaygroundInput({
                          ...playgroundInput,
                          daysSinceLastOrder: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Average Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={playgroundInput.avgOrderValue}
                      onChange={(e) =>
                        setPlaygroundInput({ ...playgroundInput, avgOrderValue: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={runPlayground}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {loading ? 'Running...' : 'Run Prediction'}
                  </button>
                </div>
              </div>

              {/* Output */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Predictions
                </h3>
                {!playgroundOutput ? (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Run prediction to see results
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Churn Prediction */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Churn Prediction
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Churn Probability
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            {(playgroundOutput.predictions.churn.churn_probability * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level</span>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              playgroundOutput.predictions.churn.risk_level === 'high'
                                ? 'bg-red-100 text-red-800'
                                : playgroundOutput.predictions.churn.risk_level === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {playgroundOutput.predictions.churn.risk_level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CLV Prediction */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Lifetime Value
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Predicted CLV
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ₹
                            {playgroundOutput.predictions.lifetime_value.predicted_clv.toLocaleString(
                              'en-IN'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Tier</span>
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                            {playgroundOutput.predictions.lifetime_value.tier}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Expected Orders
                          </span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {playgroundOutput.predictions.lifetime_value.expected_orders_next_year}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'models':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ML Models Information
            </h2>

            {!modelsInfo ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4 animate-pulse" />
                <p className="text-gray-600 dark:text-gray-400">Loading models...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modelsInfo.models.map((model: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {model.name}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          model.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {model.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {model.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                        <span className="font-medium text-green-600">
                          {(model.accuracy * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Trained</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(model.lastTrained).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Brain className="w-8 h-8 mr-3 text-purple-600" />
          ML & AI Insights
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <p className="text-gray-600 dark:text-gray-400">
            Leverage machine learning for predictions, recommendations, and anomaly detection
          </p>
          {mlServiceHealth !== null && (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                mlServiceHealth
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {mlServiceHealth ? 'ML Service Online' : 'ML Service Offline'}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'recommendations', label: 'Product Recommendations', icon: Target },
            { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
            { id: 'anomalies', label: 'Anomaly Detection', icon: AlertCircle },
            { id: 'playground', label: 'Model Playground', icon: Play },
            { id: 'models', label: 'Models Info', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
}
