"""
Ayurveda Shop ML Service
Provides ML predictions, recommendations, and analytics
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock ML models (replace with real models later)
class MLModels:
    @staticmethod
    def product_recommendations(customer_id, num_recommendations=5):
        """Generate product recommendations for a customer"""
        # Mock recommendations - replace with real collaborative filtering
        products = [
            {"id": 1, "name": "Ashwagandha Capsules", "score": 0.92, "reason": "Based on your immunity category preference"},
            {"id": 2, "name": "Turmeric Gold", "score": 0.88, "reason": "Customers like you also bought this"},
            {"id": 3, "name": "Triphala Powder", "score": 0.85, "reason": "Popular in your region"},
            {"id": 4, "name": "Brahmi Oil", "score": 0.82, "reason": "Complements your previous purchases"},
            {"id": 5, "name": "Chyawanprash", "score": 0.78, "reason": "Seasonal recommendation"},
        ]
        return products[:num_recommendations]

    @staticmethod
    def demand_forecast(product_id, days=30):
        """Forecast product demand for next N days"""
        # Mock forecast - replace with real time series model (ARIMA, Prophet, etc.)
        base_demand = np.random.randint(50, 150)
        trend = np.random.uniform(-0.5, 1.5)
        seasonality = np.random.uniform(0.8, 1.2)

        forecasts = []
        start_date = datetime.now()

        for day in range(days):
            date = start_date + timedelta(days=day)
            # Add trend, seasonality, and random noise
            predicted = base_demand + (trend * day) + (seasonality * np.sin(day * 2 * np.pi / 7)) + np.random.normal(0, 10)
            predicted = max(0, predicted)  # Ensure non-negative

            forecasts.append({
                "date": date.isoformat(),
                "predicted": round(predicted, 2),
                "lower": round(predicted * 0.8, 2),
                "upper": round(predicted * 1.2, 2),
                "confidence": 0.85
            })

        return forecasts

    @staticmethod
    def anomaly_detection(metric_type="revenue"):
        """Detect anomalies in business metrics"""
        # Mock anomaly detection - replace with real models (Isolation Forest, LSTM)
        anomalies = [
            {
                "date": (datetime.now() - timedelta(days=2)).isoformat(),
                "metric": metric_type,
                "expected": 125000,
                "actual": 45000,
                "severity": "high",
                "anomaly_score": 0.92,
                "reason": "Significant drop in orders - possible technical issue"
            },
            {
                "date": (datetime.now() - timedelta(days=5)).isoformat(),
                "metric": metric_type,
                "expected": 8500,
                "actual": 15200,
                "severity": "medium",
                "anomaly_score": 0.71,
                "reason": "Unusual spike in traffic from social media campaign"
            }
        ]
        return anomalies

    @staticmethod
    def customer_churn_prediction(customer_data):
        """Predict customer churn probability"""
        # Mock prediction - replace with real classification model
        days_since_last = customer_data.get('daysSinceLastOrder', 30)
        order_history = customer_data.get('orderHistory', 5)
        avg_order_value = customer_data.get('avgOrderValue', 2000)

        # Simple rule-based (replace with real ML model)
        if days_since_last > 90:
            churn_prob = 0.85
            risk = "high"
        elif days_since_last > 60:
            churn_prob = 0.65
            risk = "medium"
        elif order_history < 3:
            churn_prob = 0.45
            risk = "medium"
        else:
            churn_prob = 0.15
            risk = "low"

        return {
            "churn_probability": churn_prob,
            "risk_level": risk,
            "factors": [
                f"Days since last order: {days_since_last}",
                f"Order history: {order_history} orders",
                f"Average order value: ₹{avg_order_value}"
            ],
            "recommendations": [
                "Send personalized discount offer",
                "Recommend products based on past purchases",
                "Send re-engagement email campaign"
            ]
        }

    @staticmethod
    def lifetime_value_prediction(customer_data):
        """Predict customer lifetime value"""
        # Mock CLV prediction
        total_spent = customer_data.get('totalSpent', 10000)
        order_history = customer_data.get('orderHistory', 5)
        days_since_last = customer_data.get('daysSinceLastOrder', 30)

        # Simple calculation (replace with real model)
        avg_order = total_spent / max(order_history, 1)
        retention_factor = max(0.1, 1 - (days_since_last / 365))

        clv = avg_order * order_history * retention_factor * 3  # 3 year projection

        return {
            "predicted_clv": round(clv, 2),
            "confidence": 0.78,
            "tier": "gold" if clv > 50000 else "silver" if clv > 25000 else "bronze",
            "expected_orders_next_year": round(order_history * retention_factor),
            "growth_potential": "high" if retention_factor > 0.7 else "medium"
        }


# API Endpoints

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "ml-service", "version": "1.0.0"})

@app.route('/api/ml/recommendations', methods=['POST'])
def get_recommendations():
    """Get product recommendations for a customer"""
    try:
        data = request.json
        customer_id = data.get('customerId')
        num_recs = data.get('numRecommendations', 5)

        recommendations = MLModels.product_recommendations(customer_id, num_recs)

        return jsonify({
            "success": True,
            "customerId": customer_id,
            "recommendations": recommendations,
            "generatedAt": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/forecast', methods=['POST'])
def get_forecast():
    """Get demand forecast for a product"""
    try:
        data = request.json
        product_id = data.get('productId')
        days = data.get('days', 30)

        forecasts = MLModels.demand_forecast(product_id, days)

        return jsonify({
            "success": True,
            "productId": product_id,
            "forecasts": forecasts,
            "model": "arima",
            "accuracy": 0.85
        })
    except Exception as e:
        logger.error(f"Error generating forecast: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/anomalies', methods=['GET'])
def get_anomalies():
    """Detect anomalies in business metrics"""
    try:
        metric_type = request.args.get('metric', 'revenue')
        anomalies = MLModels.anomaly_detection(metric_type)

        return jsonify({
            "success": True,
            "metric": metric_type,
            "anomalies": anomalies,
            "detectedAt": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error detecting anomalies: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/predict/churn', methods=['POST'])
def predict_churn():
    """Predict customer churn"""
    try:
        customer_data = request.json
        prediction = MLModels.customer_churn_prediction(customer_data)

        return jsonify({
            "success": True,
            "prediction": prediction
        })
    except Exception as e:
        logger.error(f"Error predicting churn: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/predict/clv', methods=['POST'])
def predict_clv():
    """Predict customer lifetime value"""
    try:
        customer_data = request.json
        prediction = MLModels.lifetime_value_prediction(customer_data)

        return jsonify({
            "success": True,
            "prediction": prediction
        })
    except Exception as e:
        logger.error(f"Error predicting CLV: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/playground', methods=['POST'])
def playground():
    """ML model playground for testing"""
    try:
        input_data = request.json

        # Run multiple predictions
        churn = MLModels.customer_churn_prediction(input_data)
        clv = MLModels.lifetime_value_prediction(input_data)

        return jsonify({
            "success": True,
            "input": input_data,
            "predictions": {
                "churn": churn,
                "lifetime_value": clv
            },
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Playground error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/ml/models/info', methods=['GET'])
def models_info():
    """Get information about available ML models"""
    return jsonify({
        "models": [
            {
                "name": "Product Recommendations",
                "type": "collaborative_filtering",
                "status": "active",
                "accuracy": 0.87,
                "lastTrained": "2024-11-10T10:00:00Z"
            },
            {
                "name": "Demand Forecast",
                "type": "time_series",
                "status": "active",
                "accuracy": 0.85,
                "lastTrained": "2024-11-12T08:00:00Z"
            },
            {
                "name": "Churn Prediction",
                "type": "classification",
                "status": "active",
                "accuracy": 0.82,
                "lastTrained": "2024-11-14T12:00:00Z"
            },
            {
                "name": "Anomaly Detection",
                "type": "unsupervised",
                "status": "active",
                "accuracy": 0.79,
                "lastTrained": "2024-11-15T06:00:00Z"
            }
        ]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
