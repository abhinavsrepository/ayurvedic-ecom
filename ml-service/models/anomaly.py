"""
Anomaly Detection
Detect anomalies in business metrics (revenue, orders, traffic, etc.)
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

try:
    from pyod.models.iforest import IForest
    from pyod.models.lof import LOF
    PYOD_AVAILABLE = True
except ImportError:
    PYOD_AVAILABLE = False
    logger.warning("PyOD not installed. Using statistical anomaly detection")


class AnomalyDetector:
    """Detect anomalies in time-series business metrics"""

    def __init__(self, method: str = 'isolation_forest'):
        """
        Initialize anomaly detector

        Args:
            method: Detection method ('isolation_forest', 'lof', or 'statistical')
        """
        self.method = method
        self.model = None

        if PYOD_AVAILABLE and method == 'isolation_forest':
            self.model = IForest(contamination=0.1, random_state=42)
        elif PYOD_AVAILABLE and method == 'lof':
            self.model = LOF(contamination=0.1)

    def detect_anomalies(
        self,
        data: pd.DataFrame,
        metric_column: str = 'value',
        threshold: float = 2.5
    ) -> List[Dict]:
        """
        Detect anomalies in time-series data

        Args:
            data: DataFrame with columns ['date', metric_column]
            metric_column: Name of the metric column
            threshold: Standard deviations for statistical method

        Returns:
            List of detected anomalies
        """
        if len(data) < 7:
            logger.warning("Insufficient data for anomaly detection")
            return []

        if self.model and PYOD_AVAILABLE:
            return self._ml_based_detection(data, metric_column)
        else:
            return self._statistical_detection(data, metric_column, threshold)

    def _ml_based_detection(
        self,
        data: pd.DataFrame,
        metric_column: str
    ) -> List[Dict]:
        """Machine learning-based anomaly detection using Isolation Forest or LOF"""
        try:
            # Prepare features
            df = data.copy()
            df['date'] = pd.to_datetime(df['date'])
            df = df.sort_values('date')

            # Create features
            features = []
            for i in range(len(df)):
                row_features = [
                    df[metric_column].iloc[i],
                    df['date'].iloc[i].dayofweek,  # Day of week
                    df['date'].iloc[i].hour if 'hour' in df.columns else 12,
                ]

                # Add rolling statistics
                if i >= 7:
                    window = df[metric_column].iloc[max(0, i-7):i]
                    row_features.extend([
                        window.mean(),
                        window.std(),
                    ])
                else:
                    row_features.extend([df[metric_column].iloc[i], 0])

                features.append(row_features)

            X = np.array(features)

            # Fit and predict
            self.model.fit(X)
            predictions = self.model.predict(X)  # 0 = normal, 1 = anomaly
            scores = self.model.decision_scores_

            # Extract anomalies
            anomalies = []
            for i, (pred, score) in enumerate(zip(predictions, scores)):
                if pred == 1:  # Anomaly detected
                    # Calculate expected value (mean of previous 7 days)
                    if i >= 7:
                        expected = df[metric_column].iloc[max(0, i-7):i].mean()
                    else:
                        expected = df[metric_column].mean()

                    actual = df[metric_column].iloc[i]
                    deviation = ((actual - expected) / expected * 100) if expected > 0 else 0

                    severity = self._calculate_severity(score, scores)

                    anomalies.append({
                        'date': df['date'].iloc[i].isoformat(),
                        'metric': metric_column,
                        'expected': round(expected, 2),
                        'actual': round(actual, 2),
                        'deviation_percent': round(deviation, 2),
                        'severity': severity,
                        'anomaly_score': round(float(score), 3),
                        'reason': self._generate_reason(actual, expected, deviation),
                    })

            return anomalies

        except Exception as e:
            logger.error(f"ML-based detection failed: {e}")
            return self._statistical_detection(data, metric_column)

    def _statistical_detection(
        self,
        data: pd.DataFrame,
        metric_column: str,
        threshold: float = 2.5
    ) -> List[Dict]:
        """Statistical anomaly detection using Z-score and moving averages"""
        df = data.copy()
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')

        # Calculate statistics
        mean = df[metric_column].mean()
        std = df[metric_column].std()

        # Calculate moving average
        df['ma_7'] = df[metric_column].rolling(window=7, min_periods=1).mean()
        df['ma_std'] = df[metric_column].rolling(window=7, min_periods=1).std()

        anomalies = []

        for i, row in df.iterrows():
            value = row[metric_column]
            ma = row['ma_7']
            ma_std = row['ma_std'] if not pd.isna(row['ma_std']) else std

            # Z-score based on moving average
            z_score = abs((value - ma) / ma_std) if ma_std > 0 else 0

            if z_score > threshold:
                deviation = ((value - ma) / ma * 100) if ma > 0 else 0

                severity = (
                    'critical' if z_score > 4 else
                    'high' if z_score > 3 else
                    'medium'
                )

                anomalies.append({
                    'date': row['date'].isoformat(),
                    'metric': metric_column,
                    'expected': round(ma, 2),
                    'actual': round(value, 2),
                    'deviation_percent': round(deviation, 2),
                    'severity': severity,
                    'anomaly_score': round(z_score, 3),
                    'reason': self._generate_reason(value, ma, deviation),
                })

        return anomalies

    def detect_revenue_anomalies(
        self,
        revenue_data: pd.DataFrame
    ) -> Dict:
        """
        Detect anomalies in revenue metrics

        Args:
            revenue_data: DataFrame with columns ['date', 'revenue', 'orders']

        Returns:
            Anomaly detection results
        """
        results = {
            'revenue_anomalies': [],
            'order_anomalies': [],
            'aov_anomalies': [],
        }

        # Revenue anomalies
        if 'revenue' in revenue_data.columns:
            results['revenue_anomalies'] = self.detect_anomalies(
                revenue_data[['date', 'revenue']].rename(columns={'revenue': 'value'}),
                metric_column='value'
            )

        # Order anomalies
        if 'orders' in revenue_data.columns:
            results['order_anomalies'] = self.detect_anomalies(
                revenue_data[['date', 'orders']].rename(columns={'orders': 'value'}),
                metric_column='value'
            )

        # AOV anomalies
        if 'revenue' in revenue_data.columns and 'orders' in revenue_data.columns:
            aov_data = revenue_data.copy()
            aov_data['aov'] = aov_data['revenue'] / aov_data['orders'].replace(0, 1)
            results['aov_anomalies'] = self.detect_anomalies(
                aov_data[['date', 'aov']].rename(columns={'aov': 'value'}),
                metric_column='value'
            )

        return results

    def detect_traffic_anomalies(
        self,
        traffic_data: pd.DataFrame
    ) -> List[Dict]:
        """
        Detect anomalies in website traffic

        Args:
            traffic_data: DataFrame with columns ['date', 'visitors', 'page_views']

        Returns:
            Traffic anomalies
        """
        anomalies = []

        if 'visitors' in traffic_data.columns:
            visitor_anomalies = self.detect_anomalies(
                traffic_data[['date', 'visitors']].rename(columns={'visitors': 'value'}),
                metric_column='value'
            )
            anomalies.extend(visitor_anomalies)

        if 'page_views' in traffic_data.columns:
            pageview_anomalies = self.detect_anomalies(
                traffic_data[['date', 'page_views']].rename(columns={'page_views': 'value'}),
                metric_column='value'
            )
            anomalies.extend(pageview_anomalies)

        return anomalies

    def _calculate_severity(self, score: float, all_scores: np.ndarray) -> str:
        """Calculate severity level based on anomaly score"""
        percentile_90 = np.percentile(all_scores, 90)
        percentile_95 = np.percentile(all_scores, 95)
        percentile_99 = np.percentile(all_scores, 99)

        if score >= percentile_99:
            return 'critical'
        elif score >= percentile_95:
            return 'high'
        elif score >= percentile_90:
            return 'medium'
        else:
            return 'low'

    def _generate_reason(
        self,
        actual: float,
        expected: float,
        deviation: float
    ) -> str:
        """Generate human-readable reason for anomaly"""
        if actual > expected:
            direction = "spike"
            if abs(deviation) > 100:
                return f"Unusual {direction} - {abs(deviation):.0f}% above normal (possible campaign or viral effect)"
            elif abs(deviation) > 50:
                return f"Significant {direction} - {abs(deviation):.0f}% above normal (investigate traffic sources)"
            else:
                return f"Moderate {direction} - {abs(deviation):.0f}% above normal"
        else:
            direction = "drop"
            if abs(deviation) > 100:
                return f"Critical {direction} - {abs(deviation):.0f}% below normal (possible technical issue)"
            elif abs(deviation) > 50:
                return f"Significant {direction} - {abs(deviation):.0f}% below normal (investigate immediately)"
            else:
                return f"Moderate {direction} - {abs(deviation):.0f}% below normal"


def generate_mock_metrics_data(days: int = 90) -> pd.DataFrame:
    """Generate mock metrics data for testing"""
    dates = pd.date_range(end=datetime.now(), periods=days, freq='D')

    # Generate metrics with normal pattern
    base_revenue = 25000
    trend = np.linspace(0, 5000, days)
    seasonality = 3000 * np.sin(np.arange(days) * 2 * np.pi / 7)
    noise = np.random.normal(0, 1000, days)

    revenue = base_revenue + trend + seasonality + noise

    # Inject some anomalies
    anomaly_indices = [10, 25, 60, 75]
    for idx in anomaly_indices:
        if idx < len(revenue):
            if np.random.random() > 0.5:
                revenue[idx] *= 0.4  # Drop
            else:
                revenue[idx] *= 1.8  # Spike

    revenue = np.maximum(revenue, 0)

    return pd.DataFrame({
        'date': dates,
        'revenue': revenue.round(2),
        'orders': (revenue / 500 + np.random.normal(0, 5, days)).round(0).astype(int),
    })
