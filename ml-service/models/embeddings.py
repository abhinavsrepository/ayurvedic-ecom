"""
Vector Embedding Service
Generates embeddings for products and search queries using sentence-transformers
"""

import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Generate and manage vector embeddings for products and queries"""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        """
        Initialize embedding model

        Args:
            model_name: HuggingFace model identifier
        """
        logger.info(f"Loading embedding model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        logger.info(f"Embedding dimension: {self.embedding_dim}")

    def encode_product(self, product: Dict) -> np.ndarray:
        """
        Generate embedding for a product

        Args:
            product: Product dictionary with fields (name, description, category, etc.)

        Returns:
            numpy array of shape (embedding_dim,)
        """
        # Create rich text representation
        text_parts = []

        if product.get('name'):
            text_parts.append(f"Product: {product['name']}")

        if product.get('category'):
            text_parts.append(f"Category: {product['category']}")

        if product.get('brand'):
            text_parts.append(f"Brand: {product['brand']}")

        if product.get('description'):
            text_parts.append(product['description'])

        if product.get('short_description'):
            text_parts.append(product['short_description'])

        # Ayurveda-specific fields
        if product.get('ingredients'):
            ingredients = ', '.join(product['ingredients']) if isinstance(product['ingredients'], list) else product['ingredients']
            text_parts.append(f"Ingredients: {ingredients}")

        if product.get('benefits'):
            benefits = ', '.join(product['benefits']) if isinstance(product['benefits'], list) else product['benefits']
            text_parts.append(f"Benefits: {benefits}")

        if product.get('dosha_type'):
            text_parts.append(f"Dosha: {product['dosha_type']}")

        text = ". ".join(text_parts)

        # Generate embedding
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding

    def encode_products_batch(self, products: List[Dict]) -> np.ndarray:
        """
        Generate embeddings for multiple products

        Args:
            products: List of product dictionaries

        Returns:
            numpy array of shape (num_products, embedding_dim)
        """
        texts = []
        for product in products:
            # Create text representation
            text_parts = [
                product.get('name', ''),
                product.get('category', ''),
                product.get('description', '')[:500],  # Limit description length
            ]
            texts.append(". ".join([t for t in text_parts if t]))

        embeddings = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=True)
        return embeddings

    def encode_query(self, query: str, query_type: str = "search") -> np.ndarray:
        """
        Generate embedding for a search query

        Args:
            query: Search query string
            query_type: Type of query (search, recommendation, etc.)

        Returns:
            numpy array of shape (embedding_dim,)
        """
        if query_type == "health_goal":
            # Enhance health goal queries with context
            enhanced_query = f"Ayurvedic remedy for {query}. Natural treatment. Herbal medicine."
        else:
            enhanced_query = query

        embedding = self.model.encode(enhanced_query, convert_to_numpy=True)
        return embedding

    def similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two embeddings

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            Cosine similarity score between -1 and 1
        """
        return float(np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        ))

    def similarity_matrix(self, embeddings1: np.ndarray, embeddings2: np.ndarray) -> np.ndarray:
        """
        Calculate cosine similarity matrix between two sets of embeddings

        Args:
            embeddings1: Array of shape (n, embedding_dim)
            embeddings2: Array of shape (m, embedding_dim)

        Returns:
            Similarity matrix of shape (n, m)
        """
        # Normalize embeddings
        norm1 = embeddings1 / np.linalg.norm(embeddings1, axis=1, keepdims=True)
        norm2 = embeddings2 / np.linalg.norm(embeddings2, axis=1, keepdims=True)

        # Compute dot product (cosine similarity)
        return np.dot(norm1, norm2.T)


# Global instance
_embedding_service = None


def get_embedding_service(model_name: str = "sentence-transformers/all-MiniLM-L6-v2") -> EmbeddingService:
    """Get or create global embedding service instance"""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService(model_name)
    return _embedding_service
