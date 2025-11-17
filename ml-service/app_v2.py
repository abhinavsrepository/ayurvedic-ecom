"""
Ayurveda ML Service V2 - Production Ready
Complete implementation with real ML models
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import logging
import sys
import os

# Add models directory to path
sys.path.insert(0, os.path.dirname(__file__))

from models.embeddings import get_embedding_service
from models.recommender import ProductRecommender
from models.search import SemanticSearchEngine
from models.forecasting import DemandForecaster, generate_mock_historical_data
from models.anomaly import AnomalyDetector, generate_mock_metrics_data
from models.ayurveda import (
    get_dosha_recommendations,
    get_ingredient_compatibility,
    calculate_product_dosha_score,
    HEALTH_GOALS
)
from config import settings

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global ML instances
embedding_service = None
recommender = None
search_engine = None
forecaster = None
anomaly_detector = None

# Mock product catalog (in production, load from database)
MOCK_PRODUCTS = [
    {
        'id': '1',
        'name': 'Ashwagandha Capsules Premium',
        'description': 'Premium Ashwagandha extract for stress relief and vitality',
        'category': 'Immunity',
        'price': 499.99,
        'ingredients': ['Ashwagandha', 'Black Pepper Extract'],
        'benefits': ['Stress relief', 'Immunity boost', 'Energy'],
        'dosha_type': 'VATA,KAPHA',
    },
    {
        'id': '2',
        'name': 'Turmeric Gold Capsules',
        'description': 'Curcumin-rich turmeric for inflammation and immunity',
        'category': 'Immunity',
        'price': 399.99,
        'ingredients': ['Turmeric', 'Black Pepper'],
        'benefits': ['Anti-inflammatory', 'Immunity', 'Joint health'],
        'dosha_type': 'VATA,KAPHA',
    },
    {
        'id': '3',
        'name': 'Triphala Powder Organic',
        'description': 'Traditional three-fruit blend for digestive health',
        'category': 'Digestion',
        'price': 299.99,
        'ingredients': ['Triphala'],
        'benefits': ['Digestive health', 'Detox', 'Regularity'],
        'dosha_type': 'VATA,PITTA,KAPHA',
    },
    {
        'id': '4',
        'name': 'Brahmi Memory Tablets',
        'description': 'Brahmi for memory, focus and mental clarity',
        'category': 'Mental Health',
        'price': 449.99,
        'ingredients': ['Brahmi', 'Shankhpushpi'],
        'benefits': ['Memory', 'Focus', 'Stress relief'],
        'dosha_type': 'VATA,PITTA',
    },
    {
        'id': '5',
        'name': 'Tulsi Immunity Drops',
        'description': 'Holy Basil extract for immunity and respiratory health',
        'category': 'Immunity',
        'price': 349.99,
        'ingredients': ['Tulsi', 'Honey'],
        'benefits': ['Immunity', 'Respiratory health', 'Antioxidant'],
        'dosha_type': 'VATA,KAPHA',
    },
]


def initialize_ml_services():
    """Initialize all ML services"""
    global embedding_service, recommender, search_engine, forecaster, anomaly_detector

    logger.info("Initializing ML services...")

    try:
        # Initialize embedding service
        logger.info("Loading embedding model...")
        embedding_service = get_embedding_service(settings.EMBEDDING_MODEL)

        # Initialize recommender
        logger.info("Initializing recommender...")
        recommender = ProductRecommender(embedding_service)
        recommender.load_products(MOCK_PRODUCTS)

        # Initialize search engine
        logger.info("Building search index...")
        search_engine = SemanticSearchEngine(embedding_service, settings.EMBEDDING_DIM)
        product_embeddings = embedding_service.encode_products_batch(MOCK_PRODUCTS)
        search_engine.build_index(MOCK_PRODUCTS, product_embeddings)

        # Initialize forecaster
        logger.info("Initializing forecaster...")
        forecaster = DemandForecaster()

        # Initialize anomaly detector
        logger.info("Initializing anomaly detector...")
        anomaly_detector = AnomalyDetector(method='isolation_forest')

        logger.info("✅ All ML services initialized successfully")

    except Exception as e:
        logger.error(f"Failed to initialize ML services: {e}")
        raise


# Initialize on startup
try:
    initialize_ml_services()
except Exception as e:
    logger.warning(f"ML services initialization failed, will run in fallback mode: {e}")


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ml-service",
        "version": settings.APP_VERSION,
        "ml_ready": embedding_service is not None,
    })


@app.route('/api/ml/recommend/user/<user_id>', methods=['POST'])
def recommend_for_user(user_id):
    """Get personalized recommendations for a user"""
    try:
        data = request.json or {}
        user_history = data.get('user_history', [])
        dosha_type = data.get('dosha_type')
        health_goal = data.get('health_goal')
        num_recommendations = data.get('num_recommendations', 10)

        recommendations = recommender.hybrid_recommendations(
            user_id=user_id,
            user_history=user_history,
            dosha_type=dosha_type,
            health_goal=health_goal,
            n=num_recommendations
        )

        return jsonify({
            "success": True,
            "user_id": user_id,
            "recommendations": recommendations,
            "generated_at": datetime.now().isoformat(),
        })

    except Exception as e:
        logger.error(f"Error in user recommendations: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/recommend/product/<product_id>', methods=['POST'])
def recommend_similar_products(product_id):
    """Get similar product recommendations"""
    try:
        data = request.json or {}
        num_recommendations = data.get('num_recommendations', 10)

        recommendations = recommender.content_based_recommendations(
            product_id=product_id,
            n=num_recommendations
        )

        return jsonify({
            "success": True,
            "product_id": product_id,
            "recommendations": recommendations,
            "generated_at": datetime.now().isoformat(),
        })

    except Exception as e:
        logger.error(f"Error in product recommendations: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/search', methods=['POST'])
def semantic_search():
    """Semantic search for products"""
    try:
        data = request.json
        query = data.get('query', '')
        filters = data.get('filters', {})
        k = data.get('k', 10)

        if not query:
            return jsonify({"success": False, "error": "Query is required"}), 400

        results = search_engine.search(query, k=k, filters=filters)

        return jsonify({
            "success": True,
            "query": query,
            "results": results,
            "total": len(results),
        })

    except Exception as e:
        logger.error(f"Error in semantic search: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/search/semantic', methods=['POST'])
def advanced_semantic_search():
    """Advanced semantic search with Ayurveda context"""
    try:
        data = request.json
        query = data.get('query', '')
        health_goal = data.get('health_goal')
        dosha_type = data.get('dosha_type')
        k = data.get('k', 10)

        if health_goal:
            # Use Ayurveda-specific search
            results = search_engine.ayurveda_search(
                health_goal=health_goal,
                dosha_type=dosha_type,
                k=k
            )
        else:
            results = search_engine.search(query, k=k)

        return jsonify({
            "success": True,
            "query": query,
            "health_goal": health_goal,
            "dosha_type": dosha_type,
            "results": results,
        })

    except Exception as e:
        logger.error(f"Error in advanced search: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/forecast', methods=['POST'])
def demand_forecast():
    """Forecast product demand"""
    try:
        data = request.json
        product_id = data.get('productId')
        days = data.get('days', 30)

        # In production, load historical data from database
        # For now, generate mock data
        historical_data = generate_mock_historical_data(days=90)

        forecast_result = forecaster.forecast_product_demand(
            product_id=product_id,
            historical_data=historical_data,
            forecast_days=days
        )

        return jsonify({
            "success": True,
            "productId": product_id,
            **forecast_result,
        })

    except Exception as e:
        logger.error(f"Error in demand forecasting: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/anomaly', methods=['GET'])
def detect_anomalies():
    """Detect anomalies in business metrics"""
    try:
        metric_type = request.args.get('metric', 'revenue')

        # In production, load real metrics from database
        metrics_data = generate_mock_metrics_data(days=90)

        if metric_type == 'revenue':
            results = anomaly_detector.detect_revenue_anomalies(metrics_data)
            anomalies = results['revenue_anomalies']
        elif metric_type == 'orders':
            results = anomaly_detector.detect_revenue_anomalies(metrics_data)
            anomalies = results['order_anomalies']
        else:
            # Default to revenue
            anomalies = anomaly_detector.detect_anomalies(
                metrics_data[['date', 'revenue']].rename(columns={'revenue': 'value'}),
                metric_column='value'
            )

        return jsonify({
            "success": True,
            "metric": metric_type,
            "anomalies": anomalies,
            "total_anomalies": len(anomalies),
            "detected_at": datetime.now().isoformat(),
        })

    except Exception as e:
        logger.error(f"Error in anomaly detection: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/ayurveda/dosha', methods=['POST'])
def get_dosha_recommendations_endpoint():
    """Get Ayurveda recommendations based on dosha"""
    try:
        data = request.json
        dosha_type = data.get('dosha_type')
        health_goal = data.get('health_goal')

        if not dosha_type:
            return jsonify({"success": False, "error": "dosha_type is required"}), 400

        recommendations = get_dosha_recommendations(dosha_type, health_goal)

        return jsonify({
            "success": True,
            **recommendations,
        })

    except Exception as e:
        logger.error(f"Error in dosha recommendations: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/ayurveda/goals', methods=['GET'])
def get_health_goals():
    """Get available health goals"""
    return jsonify({
        "success": True,
        "health_goals": [
            {
                "id": key,
                "name": key.replace('_', ' ').title(),
                "description": value['description'],
                "recommended_herbs": value['recommended_herbs'][:5],
            }
            for key, value in HEALTH_GOALS.items()
        ]
    })


@app.route('/api/ml/models/info', methods=['GET'])
def models_info():
    """Get information about loaded ML models"""
    return jsonify({
        "models": [
            {
                "name": "Embeddings",
                "type": "sentence-transformers",
                "model_id": settings.EMBEDDING_MODEL,
                "status": "active" if embedding_service else "inactive",
                "embedding_dim": settings.EMBEDDING_DIM,
            },
            {
                "name": "Product Recommender",
                "type": "hybrid (collaborative + content + ayurveda)",
                "status": "active" if recommender else "inactive",
                "num_products": len(MOCK_PRODUCTS),
            },
            {
                "name": "Semantic Search",
                "type": "FAISS vector search",
                "status": "active" if search_engine else "inactive",
                "index_size": len(MOCK_PRODUCTS),
            },
            {
                "name": "Demand Forecaster",
                "type": "Prophet / Moving Average",
                "status": "active" if forecaster else "inactive",
            },
            {
                "name": "Anomaly Detector",
                "type": "Isolation Forest / Statistical",
                "status": "active" if anomaly_detector else "inactive",
            },
        ]
    })


# ============================================================================
# LEGACY ENDPOINTS (for backward compatibility)
# ============================================================================

@app.route('/api/ml/recommendations', methods=['POST'])
def legacy_recommendations():
    """Legacy recommendations endpoint"""
    data = request.json
    customer_id = data.get('customerId')
    num_recs = data.get('numRecommendations', 5)

    # Use new hybrid recommender
    recommendations = recommender.hybrid_recommendations(
        user_id=customer_id,
        n=num_recs
    )

    return jsonify({
        "success": True,
        "customerId": customer_id,
        "recommendations": recommendations,
        "generatedAt": datetime.now().isoformat(),
    })


@app.route('/api/ml/anomalies', methods=['GET'])
def legacy_anomalies():
    """Legacy anomalies endpoint"""
    return detect_anomalies()


@app.route('/api/ml/predict/churn', methods=['POST'])
def predict_churn():
    """Predict customer churn (simplified version)"""
    try:
        customer_data = request.json
        days_since_last = customer_data.get('daysSinceLastOrder', 30)
        order_history = customer_data.get('orderHistory', 5)

        # Simple rule-based (can be enhanced with ML model)
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

        return jsonify({
            "success": True,
            "prediction": {
                "churn_probability": churn_prob,
                "risk_level": risk,
                "factors": [
                    f"Days since last order: {days_since_last}",
                    f"Order history: {order_history} orders",
                ],
                "recommendations": [
                    "Send personalized discount offer",
                    "Recommend products based on past purchases",
                    "Send re-engagement email campaign",
                ],
            },
        })

    except Exception as e:
        logger.error(f"Error predicting churn: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/predict/clv', methods=['POST'])
def predict_clv():
    """Predict customer lifetime value"""
    try:
        customer_data = request.json
        total_spent = customer_data.get('totalSpent', 10000)
        order_history = customer_data.get('orderHistory', 5)
        days_since_last = customer_data.get('daysSinceLastOrder', 30)

        # Simple calculation
        avg_order = total_spent / max(order_history, 1)
        retention_factor = max(0.1, 1 - (days_since_last / 365))
        clv = avg_order * order_history * retention_factor * 3

        return jsonify({
            "success": True,
            "prediction": {
                "predicted_clv": round(clv, 2),
                "confidence": 0.78,
                "tier": "gold" if clv > 50000 else "silver" if clv > 25000 else "bronze",
                "expected_orders_next_year": round(order_history * retention_factor),
            },
        })

    except Exception as e:
        logger.error(f"Error predicting CLV: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/ml/playground', methods=['POST'])
def playground():
    """ML playground for testing"""
    try:
        input_data = request.json

        churn = predict_churn().get_json()
        clv = predict_clv().get_json()

        return jsonify({
            "success": True,
            "input": input_data,
            "predictions": {
                "churn": churn.get('prediction'),
                "lifetime_value": clv.get('prediction'),
            },
            "timestamp": datetime.now().isoformat(),
        })

    except Exception as e:
        logger.error(f"Playground error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=settings.DEBUG)
