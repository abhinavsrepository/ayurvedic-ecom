'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle, Zap, Target, Play } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  getMockRecommendations,
  getMockForecasts,
  getMockAnomalies,
  generateCustomerPredictions,
  generateABTests,
  runPlaygroundPrediction,
  type PlaygroundInput,
} from '@/lib/mocks/ml';

export default function MLPage() {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'forecast' | 'anomalies' | 'predictions' | 'ab-tests' | 'playground'>('recommendations');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [abTests, setAbTests] = useState<any[]>([]);
  const [playgroundInput, setPlaygroundInput] = useState<PlaygroundInput>({
    orderHistory: 5,
    totalSpent: 10000,
    daysSinceLastOrder: 30,
    avgOrderValue: 2000,
    categoryPreference: 'Immunity Boosters',
  });
  const [playgroundOutput, setPlaygroundOutput] = useState<any>(null);

  useEffect(() => {
    setRecommendations(getMockRecommendations());
    setForecasts(getMockForecasts());
    setAnomalies(getMockAnomalies());
    setPredictions(generateCustomerPredictions());
    setAbTests(generateABTests());
  }, []);

  const handlePlaygroundRun = () => {
    const output = runPlaygroundPrediction(playgroundInput);
    setPlaygroundOutput(output);
  };

  const getForecastChart = (forecast: any) => {
    return {
      labels: forecast.forecasts.map((f: any) => new Date(f.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Predicted Demand',
          data: forecast.forecasts.map((f: any) => f.predicted),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Upper Bound',
          data: forecast.forecasts.map((f: any) => f.upper),
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderDash: [5, 5],
          fill: false,
        },
        {
          label: 'Lower Bound',
          data: forecast.forecasts.map((f: any) => f.lower),
          borderColor: 'rgba(239, 68, 68, 0.5)',
          borderDash: [5, 5],
          fill: false,
        },
      ],
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <Brain className="w-8 h-8 mr-3 text-purple-600" />
          ML & AI Insights
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Leverage machine learning for predictions, recommendations, and anomaly detection
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'recommendations', label: 'Product Recommendations', icon: Target },
            { id: 'forecast', label: 'Demand Forecast', icon: TrendingUp },
            { id: 'anomalies', label: 'Anomaly Detection', icon: AlertCircle },
            { id: 'predictions', label: 'Customer Predictions', icon: Brain },
            { id: 'ab-tests', label: 'A/B Tests', icon: Zap },
            { id: 'playground', label: 'Model Playground', icon: Play },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Product Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Powered Product Recommendations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Products predicted to drive maximum revenue based on historical patterns
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{rec.productName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      rec.confidence >= 0.8 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      rec.confidence >= 0.7 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {(rec.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{rec.reason}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Expected Revenue</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      ₹{rec.expectedRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Demand Forecast */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          {forecasts.map((forecast, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {forecast.productName} - 30 Day Forecast
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Model: {forecast.model} | Accuracy: {(forecast.accuracy * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-80">
                  <Line
                    data={getForecastChart(forecast)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Anomaly Detection */}
      {activeTab === 'anomalies' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detected Anomalies
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Unusual patterns that require attention
            </p>
          </div>
          <div className="p-6 space-y-4">
            {anomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className={`border-l-4 p-4 rounded ${
                  anomaly.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  anomaly.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <AlertCircle className={`w-5 h-5 mr-2 ${
                        anomaly.severity === 'high' ? 'text-red-600' :
                        anomaly.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {anomaly.metric.replace('_', ' ')} Anomaly
                      </h3>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        anomaly.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {anomaly.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Actual Value</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {anomaly.value.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Expected Value</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {anomaly.expected.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Deviation</p>
                        <p className="font-semibold text-red-600">
                          {(anomaly.deviation * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                    {new Date(anomaly.timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Predictions */}
      {activeTab === 'predictions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Churn & Purchase Predictions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              AI predictions for customer behavior and recommended actions
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Churn Risk
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Next Purchase
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Predicted LTV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Recommended Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {predictions.map((pred, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {pred.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          pred.churnProbability >= 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                          pred.churnProbability >= 0.4 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {(pred.churnProbability * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {(pred.nextPurchaseProbability * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      ₹{pred.predictedLTV.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <ul className="list-disc list-inside">
                        {pred.recommendedActions.map((action: string, i: number) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* A/B Tests */}
      {activeTab === 'ab-tests' && (
        <div className="space-y-6">
          {abTests.map((test, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{test.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{test.description}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    test.status === 'running' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    test.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {test.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {test.variants.map((variant: any) => (
                    <div
                      key={variant.id}
                      className={`border-2 rounded-lg p-4 ${
                        test.winner === variant.id
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{variant.name}</h3>
                        {test.winner === variant.id && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                            Winner
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Traffic:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {variant.traffic.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Conversions:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {variant.conversions.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₹{variant.revenue.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-400">Conversion Rate:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {variant.conversionRate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model Playground */}
      {activeTab === 'playground' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              ML Model Playground
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Test predictions with custom customer inputs
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Form */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Input</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Order History (count)
                  </label>
                  <input
                    type="number"
                    value={playgroundInput.orderHistory}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, orderHistory: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Total Spent (₹)
                  </label>
                  <input
                    type="number"
                    value={playgroundInput.totalSpent}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, totalSpent: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Days Since Last Order
                  </label>
                  <input
                    type="number"
                    value={playgroundInput.daysSinceLastOrder}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, daysSinceLastOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Average Order Value (₹)
                  </label>
                  <input
                    type="number"
                    value={playgroundInput.avgOrderValue}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, avgOrderValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handlePlaygroundRun}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Run Prediction
                </button>
              </div>

              {/* Output */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Prediction Output</h3>
                {playgroundOutput ? (
                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Churn Probability</p>
                      <div className="flex items-center mt-2">
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              playgroundOutput.churnProbability >= 0.7 ? 'bg-red-500' :
                              playgroundOutput.churnProbability >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${playgroundOutput.churnProbability * 100}%` }}
                          />
                        </div>
                        <span className="ml-3 font-bold text-gray-900 dark:text-white">
                          {(playgroundOutput.churnProbability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Next Purchase In</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ~{playgroundOutput.nextPurchaseDays} days
                      </p>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Order Value</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        ₹{playgroundOutput.predictedOrderValue.toFixed(0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Recommended Products</p>
                      <ul className="space-y-1">
                        {playgroundOutput.recommendedProducts.map((product: string, i: number) => (
                          <li key={i} className="text-sm text-gray-900 dark:text-white">• {product}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Model Confidence</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                        {(playgroundOutput.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8">
                    Run a prediction to see results
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
