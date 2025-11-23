"""
Demand Forecasting
Time-series forecasting for product demand using Prophet
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False
    logger.warning("Prophet not installed. Using fallback forecasting method")


class DemandForecaster:
    """Product demand forecasting using time-series models"""

    def __init__(self):
        """Initialize forecaster"""
        self.models = {}  # Store trained models per product

    def forecast_product_demand(
        self,
        product_id: str,
        historical_data: pd.DataFrame,
        forecast_days: int = 30
    ) -> Dict:
        """
        Forecast demand for a specific product

        Args:
            product_id: Product identifier
            historical_data: DataFrame with columns ['date', 'quantity']
            forecast_days: Number of days to forecast

        Returns:
            Forecast dictionary with predictions and confidence intervals
        """
        if len(historical_data) < 14:
            logger.warning(f"Insufficient data for product {product_id}. Using simple average.")
            return self._simple_forecast(historical_data, forecast_days)

        if PROPHET_AVAILABLE:
            return self._prophet_forecast(product_id, historical_data, forecast_days)
        else:
            return self._moving_average_forecast(historical_data, forecast_days)

    def _prophet_forecast(
        self,
        product_id: str,
        historical_data: pd.DataFrame,
        forecast_days: int
    ) -> Dict:
        """Use Prophet for forecasting"""
        try:
            # Prepare data for Prophet
            df = historical_data.copy()
            df.columns = ['ds', 'y']  # Prophet requires these column names
            df['ds'] = pd.to_datetime(df['ds'])

            # Initialize and fit model
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=True if len(df) > 365 else False,
                changepoint_prior_scale=0.05,
                seasonality_prior_scale=10.0,
            )

            model.fit(df)

            # Make future dataframe
            future = model.make_future_dataframe(periods=forecast_days)
            forecast = model.predict(future)

            # Extract forecast for future dates only
            forecast_future = forecast.tail(forecast_days)

            # Format results
            predictions = []
            for _, row in forecast_future.iterrows():
                predictions.append({
                    'date': row['ds'].isoformat(),
                    'predicted': max(0, round(row['yhat'], 2)),
                    'lower': max(0, round(row['yhat_lower'], 2)),
                    'upper': max(0, round(row['yhat_upper'], 2)),
                    'confidence': 0.85,
                })

            # Calculate metrics
            historical_mean = df['y'].mean()
            forecast_mean = forecast_future['yhat'].mean()
            trend = 'increasing' if forecast_mean > historical_mean else 'decreasing'

            return {
                'product_id': product_id,
                'model': 'prophet',
                'forecasts': predictions,
                'summary': {
                    'historical_avg': round(historical_mean, 2),
                    'forecast_avg': round(max(0, forecast_mean), 2),
                    'trend': trend,
                    'total_forecast': round(max(0, forecast_future['yhat'].sum()), 2),
                },
            }

        except Exception as e:
            logger.error(f"Prophet forecast failed: {e}")
            return self._moving_average_forecast(historical_data, forecast_days)

    def _moving_average_forecast(
        self,
        historical_data: pd.DataFrame,
        forecast_days: int
    ) -> Dict:
        """Simple moving average forecast"""
        # Calculate moving averages
        df = historical_data.copy()
        df['date'] = pd.to_datetime(df.iloc[:, 0])
        df['quantity'] = df.iloc[:, 1]

        # 7-day moving average
        ma_7 = df['quantity'].rolling(window=7, min_periods=1).mean().iloc[-1]

        # 30-day moving average if enough data
        ma_30 = df['quantity'].rolling(window=min(30, len(df)), min_periods=1).mean().iloc[-1]

        # Use weighted average
        base_forecast = 0.7 * ma_7 + 0.3 * ma_30

        # Calculate trend
        if len(df) >= 7:
            recent_avg = df['quantity'].tail(7).mean()
            older_avg = df['quantity'].head(7).mean()
            trend_factor = (recent_avg - older_avg) / max(older_avg, 1)
        else:
            trend_factor = 0

        # Generate forecasts
        predictions = []
        last_date = pd.to_datetime(df['date'].iloc[-1])

        for day in range(1, forecast_days + 1):
            # Apply trend
            forecast_value = base_forecast * (1 + trend_factor * (day / forecast_days))
            forecast_value = max(0, forecast_value)

            # Add some randomness for confidence intervals
            uncertainty = forecast_value * 0.2 * (1 + day / forecast_days)

            predictions.append({
                'date': (last_date + timedelta(days=day)).isoformat(),
                'predicted': round(forecast_value, 2),
                'lower': round(max(0, forecast_value - uncertainty), 2),
                'upper': round(forecast_value + uncertainty, 2),
                'confidence': 0.75 - (day / forecast_days * 0.2),  # Decreasing confidence
            })

        return {
            'model': 'moving_average',
            'forecasts': predictions,
            'summary': {
                'historical_avg': round(df['quantity'].mean(), 2),
                'forecast_avg': round(base_forecast, 2),
                'trend': 'increasing' if trend_factor > 0 else 'decreasing',
            },
        }

    def _simple_forecast(
        self,
        historical_data: pd.DataFrame,
        forecast_days: int
    ) -> Dict:
        """Very simple average-based forecast for minimal data"""
        avg_quantity = historical_data.iloc[:, 1].mean() if len(historical_data) > 0 else 10

        predictions = []
        base_date = datetime.now()

        for day in range(forecast_days):
            predictions.append({
                'date': (base_date + timedelta(days=day)).isoformat(),
                'predicted': round(avg_quantity, 2),
                'lower': round(avg_quantity * 0.7, 2),
                'upper': round(avg_quantity * 1.3, 2),
                'confidence': 0.50,
            })

        return {
            'model': 'simple_average',
            'forecasts': predictions,
            'summary': {
                'historical_avg': round(avg_quantity, 2),
                'forecast_avg': round(avg_quantity, 2),
                'trend': 'stable',
            },
            'warning': 'Insufficient historical data for accurate forecast',
        }

    def calculate_reorder_point(
        self,
        avg_daily_demand: float,
        lead_time_days: int = 7,
        service_level: float = 0.95
    ) -> Dict:
        """
        Calculate reorder point for inventory management

        Args:
            avg_daily_demand: Average daily demand
            lead_time_days: Supplier lead time in days
            service_level: Desired service level (0-1)

        Returns:
            Reorder point recommendations
        """
        # Safety stock calculation (simplified)
        # In production, use standard deviation of demand
        safety_stock = avg_daily_demand * lead_time_days * (1 / (1 - service_level))

        reorder_point = (avg_daily_demand * lead_time_days) + safety_stock

        return {
            'reorder_point': round(reorder_point, 0),
            'safety_stock': round(safety_stock, 0),
            'avg_daily_demand': round(avg_daily_demand, 2),
            'lead_time_days': lead_time_days,
            'service_level': service_level,
        }


def generate_mock_historical_data(days: int = 90) -> pd.DataFrame:
    """Generate mock historical data for testing"""
    dates = pd.date_range(end=datetime.now(), periods=days, freq='D')

    # Generate demand with trend and seasonality
    base_demand = 50
    trend = np.linspace(0, 20, days)
    seasonality = 10 * np.sin(np.arange(days) * 2 * np.pi / 7)  # Weekly pattern
    noise = np.random.normal(0, 5, days)

    quantities = base_demand + trend + seasonality + noise
    quantities = np.maximum(quantities, 0)  # Ensure non-negative

    return pd.DataFrame({
        'date': dates,
        'quantity': quantities.round(0)
    })
