"""
Product Recommendation Engine
Combines collaborative filtering, content-based, and Ayurveda-specific recommendations
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple, Optional
from sklearn.metrics.pairwise import cosine_similarity
import logging

logger = logging.getLogger(__name__)


class ProductRecommender:
    """Hybrid recommendation system combining multiple strategies"""

    def __init__(self, embedding_service):
        """
        Initialize recommender

        Args:
            embedding_service: EmbeddingService instance
        """
        self.embedding_service = embedding_service
        self.product_embeddings = None
        self.product_index = None
        self.user_interactions = None

    def load_products(self, products: List[Dict]):
        """
        Load product catalog and generate embeddings

        Args:
            products: List of product dictionaries
        """
        logger.info(f"Loading {len(products)} products")

        # Generate embeddings
        self.product_embeddings = self.embedding_service.encode_products_batch(products)

        # Create product index
        self.product_index = {i: product for i, product in enumerate(products)}

        logger.info("Products loaded and indexed")

    def content_based_recommendations(
        self,
        product_id: str,
        n: int = 10,
        category_boost: float = 0.2
    ) -> List[Dict]:
        """
        Get similar products based on content (embeddings)

        Args:
            product_id: Source product ID
            n: Number of recommendations
            category_boost: Boost for same-category products

        Returns:
            List of recommended products with scores
        """
        if self.product_embeddings is None:
            raise ValueError("Products not loaded. Call load_products() first")

        # Find product index
        product_idx = None
        for idx, product in self.product_index.items():
            if product['id'] == product_id:
                product_idx = idx
                break

        if product_idx is None:
            raise ValueError(f"Product {product_id} not found")

        # Get product embedding
        query_embedding = self.product_embeddings[product_idx]

        # Calculate similarities
        similarities = cosine_similarity(
            query_embedding.reshape(1, -1),
            self.product_embeddings
        )[0]

        # Apply category boost
        source_category = self.product_index[product_idx].get('category')
        if source_category:
            for idx, product in self.product_index.items():
                if product.get('category') == source_category and idx != product_idx:
                    similarities[idx] += category_boost

        # Get top N (excluding self)
        top_indices = np.argsort(similarities)[::-1]
        recommendations = []

        for idx in top_indices:
            if idx == product_idx:
                continue

            product = self.product_index[idx]
            recommendations.append({
                'id': product['id'],
                'name': product['name'],
                'category': product.get('category'),
                'price': product.get('price'),
                'score': float(similarities[idx]),
                'reason': 'Similar to your viewed product'
            })

            if len(recommendations) >= n:
                break

        return recommendations

    def user_based_recommendations(
        self,
        user_id: str,
        user_history: List[str],
        n: int = 10
    ) -> List[Dict]:
        """
        Get recommendations based on user's interaction history

        Args:
            user_id: User identifier
            user_history: List of product IDs user interacted with
            n: Number of recommendations

        Returns:
            List of recommended products
        """
        if not user_history:
            # Return popular products for cold start
            return self._get_popular_products(n)

        # Get embeddings of products user interacted with
        user_product_indices = []
        for product_id in user_history:
            for idx, product in self.product_index.items():
                if product['id'] == product_id:
                    user_product_indices.append(idx)
                    break

        if not user_product_indices:
            return self._get_popular_products(n)

        # Average embeddings to create user profile
        user_profile = self.product_embeddings[user_product_indices].mean(axis=0)

        # Find similar products
        similarities = cosine_similarity(
            user_profile.reshape(1, -1),
            self.product_embeddings
        )[0]

        # Exclude products user already interacted with
        for idx in user_product_indices:
            similarities[idx] = -1

        # Get top N
        top_indices = np.argsort(similarities)[::-1][:n]

        recommendations = []
        for idx in top_indices:
            product = self.product_index[idx]
            recommendations.append({
                'id': product['id'],
                'name': product['name'],
                'category': product.get('category'),
                'price': product.get('price'),
                'score': float(similarities[idx]),
                'reason': 'Based on your browsing history'
            })

        return recommendations

    def ayurveda_recommendations(
        self,
        dosha_type: str,
        health_goal: Optional[str] = None,
        n: int = 10
    ) -> List[Dict]:
        """
        Get Ayurveda-specific recommendations based on Dosha and health goals

        Args:
            dosha_type: Primary dosha (VATA, PITTA, KAPHA)
            health_goal: Specific health goal (immunity, digestion, etc.)
            n: Number of recommendations

        Returns:
            List of recommended products
        """
        recommendations = []

        # Filter products by dosha compatibility
        for idx, product in self.product_index.items():
            score = 0.5  # Base score

            # Dosha matching
            product_dosha = product.get('dosha_type', '')
            if dosha_type.upper() in product_dosha.upper():
                score += 0.3

            # Health goal matching
            if health_goal:
                benefits = product.get('benefits', [])
                if isinstance(benefits, list):
                    for benefit in benefits:
                        if health_goal.lower() in benefit.lower():
                            score += 0.2
                            break

            # Ingredient quality
            ingredients = product.get('ingredients', [])
            if isinstance(ingredients, list) and len(ingredients) > 0:
                score += 0.1 * min(len(ingredients) / 5, 1)  # Bonus for multiple ingredients

            if score > 0.5:  # Only include relevant products
                recommendations.append({
                    'id': product['id'],
                    'name': product['name'],
                    'category': product.get('category'),
                    'price': product.get('price'),
                    'score': score,
                    'reason': f'Recommended for {dosha_type} dosha',
                    'dosha_type': product.get('dosha_type'),
                    'benefits': product.get('benefits', [])
                })

        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)

        return recommendations[:n]

    def hybrid_recommendations(
        self,
        user_id: Optional[str] = None,
        user_history: Optional[List[str]] = None,
        current_product_id: Optional[str] = None,
        dosha_type: Optional[str] = None,
        health_goal: Optional[str] = None,
        n: int = 10
    ) -> List[Dict]:
        """
        Hybrid recommendations combining multiple strategies

        Args:
            user_id: User identifier
            user_history: User's product interaction history
            current_product_id: Currently viewed product
            dosha_type: User's primary dosha
            health_goal: User's health goal
            n: Number of recommendations

        Returns:
            List of recommended products with combined scores
        """
        all_recommendations = {}

        # Content-based (if viewing a product)
        if current_product_id:
            try:
                content_recs = self.content_based_recommendations(current_product_id, n=n)
                for rec in content_recs:
                    product_id = rec['id']
                    if product_id not in all_recommendations:
                        all_recommendations[product_id] = rec
                        all_recommendations[product_id]['sources'] = ['content']
                    else:
                        all_recommendations[product_id]['score'] += rec['score'] * 0.3
                        all_recommendations[product_id]['sources'].append('content')
            except Exception as e:
                logger.warning(f"Content-based recommendations failed: {e}")

        # User-based (if have history)
        if user_history and len(user_history) > 0:
            try:
                user_recs = self.user_based_recommendations(user_id, user_history, n=n)
                for rec in user_recs:
                    product_id = rec['id']
                    if product_id not in all_recommendations:
                        all_recommendations[product_id] = rec
                        all_recommendations[product_id]['sources'] = ['collaborative']
                    else:
                        all_recommendations[product_id]['score'] += rec['score'] * 0.4
                        all_recommendations[product_id]['sources'].append('collaborative')
            except Exception as e:
                logger.warning(f"User-based recommendations failed: {e}")

        # Ayurveda-based (if have dosha)
        if dosha_type:
            try:
                ayurveda_recs = self.ayurveda_recommendations(dosha_type, health_goal, n=n)
                for rec in ayurveda_recs:
                    product_id = rec['id']
                    if product_id not in all_recommendations:
                        all_recommendations[product_id] = rec
                        all_recommendations[product_id]['sources'] = ['ayurveda']
                    else:
                        all_recommendations[product_id]['score'] += rec['score'] * 0.3
                        all_recommendations[product_id]['sources'].append('ayurveda')
            except Exception as e:
                logger.warning(f"Ayurveda recommendations failed: {e}")

        # Sort by combined score
        recommendations = list(all_recommendations.values())
        recommendations.sort(key=lambda x: x['score'], reverse=True)

        return recommendations[:n]

    def _get_popular_products(self, n: int = 10) -> List[Dict]:
        """Get popular products (fallback for cold start)"""
        # For now, return first N products
        # In production, this would be based on sales/views data
        recommendations = []
        for idx in range(min(n, len(self.product_index))):
            product = self.product_index[idx]
            recommendations.append({
                'id': product['id'],
                'name': product['name'],
                'category': product.get('category'),
                'price': product.get('price'),
                'score': 0.5,
                'reason': 'Popular product'
            })
        return recommendations
