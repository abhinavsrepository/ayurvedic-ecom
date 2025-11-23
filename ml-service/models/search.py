"""
Semantic Search Engine
Vector-based similarity search for products
"""

import numpy as np
import faiss
from typing import List, Dict, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class SemanticSearchEngine:
    """Vector-based semantic search using FAISS"""

    def __init__(self, embedding_service, embedding_dim: int = 384):
        """
        Initialize search engine

        Args:
            embedding_service: EmbeddingService instance
            embedding_dim: Dimension of embeddings
        """
        self.embedding_service = embedding_service
        self.embedding_dim = embedding_dim
        self.index = None
        self.product_index = None
        self.products = None

    def build_index(self, products: List[Dict], embeddings: np.ndarray):
        """
        Build FAISS index from product embeddings

        Args:
            products: List of product dictionaries
            embeddings: Product embeddings array (n_products, embedding_dim)
        """
        logger.info(f"Building FAISS index for {len(products)} products")

        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)

        # Create FAISS index (Inner Product = Cosine Similarity for normalized vectors)
        self.index = faiss.IndexFlatIP(self.embedding_dim)
        self.index.add(embeddings.astype(np.float32))

        # Store products
        self.products = products
        self.product_index = {i: product for i, product in enumerate(products)}

        logger.info(f"FAISS index built successfully with {self.index.ntotal} vectors")

    def search(
        self,
        query: str,
        k: int = 10,
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Semantic search for products

        Args:
            query: Search query string
            k: Number of results to return
            filters: Optional filters (category, price_range, etc.)

        Returns:
            List of search results with scores
        """
        if self.index is None:
            raise ValueError("Index not built. Call build_index() first")

        # Generate query embedding
        query_embedding = self.embedding_service.encode_query(query, query_type="search")
        query_embedding = query_embedding.reshape(1, -1).astype(np.float32)

        # Normalize for cosine similarity
        faiss.normalize_L2(query_embedding)

        # Search
        scores, indices = self.index.search(query_embedding, k * 2)  # Get more results for filtering

        # Format results
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for empty results
                continue

            product = self.product_index[int(idx)]

            # Apply filters if provided
            if filters:
                if not self._apply_filters(product, filters):
                    continue

            results.append({
                'id': product['id'],
                'name': product['name'],
                'description': product.get('description', ''),
                'category': product.get('category'),
                'price': product.get('price'),
                'image': product.get('images', [None])[0] if product.get('images') else None,
                'score': float(score),
                'relevance': 'high' if score > 0.7 else 'medium' if score > 0.5 else 'low'
            })

            if len(results) >= k:
                break

        return results

    def multi_query_search(
        self,
        queries: List[str],
        k: int = 10,
        filters: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search with multiple queries and aggregate results

        Args:
            queries: List of search query strings
            k: Number of results to return
            filters: Optional filters

        Returns:
            Aggregated search results
        """
        all_results = {}

        for query in queries:
            results = self.search(query, k=k, filters=filters)

            for result in results:
                product_id = result['id']
                if product_id not in all_results:
                    all_results[product_id] = result
                    all_results[product_id]['matched_queries'] = [query]
                else:
                    # Boost score for products matching multiple queries
                    all_results[product_id]['score'] = max(
                        all_results[product_id]['score'],
                        result['score']
                    )
                    all_results[product_id]['matched_queries'].append(query)

        # Sort by score and number of matched queries
        results = list(all_results.values())
        results.sort(
            key=lambda x: (len(x['matched_queries']), x['score']),
            reverse=True
        )

        return results[:k]

    def ayurveda_search(
        self,
        health_goal: str,
        dosha_type: Optional[str] = None,
        k: int = 10
    ) -> List[Dict]:
        """
        Ayurveda-specific semantic search

        Args:
            health_goal: Health goal (e.g., "immunity", "digestion")
            dosha_type: Optional dosha filter
            k: Number of results

        Returns:
            Relevant ayurvedic products
        """
        # Enhance query with Ayurveda context
        query_parts = [f"Ayurvedic remedy for {health_goal}"]

        if dosha_type:
            query_parts.append(f"suitable for {dosha_type} dosha")

        query = ". ".join(query_parts)

        # Apply dosha filter if provided
        filters = {}
        if dosha_type:
            filters['dosha_type'] = dosha_type

        return self.search(query, k=k, filters=filters if dosha_type else None)

    def _apply_filters(self, product: Dict, filters: Dict) -> bool:
        """
        Apply filters to a product

        Args:
            product: Product dictionary
            filters: Filter criteria

        Returns:
            True if product passes all filters
        """
        # Category filter
        if 'category' in filters:
            if product.get('category') != filters['category']:
                return False

        # Price range filter
        if 'price_min' in filters:
            if not product.get('price') or product['price'] < filters['price_min']:
                return False

        if 'price_max' in filters:
            if not product.get('price') or product['price'] > filters['price_max']:
                return False

        # Dosha filter
        if 'dosha_type' in filters:
            dosha_filter = filters['dosha_type'].upper()
            product_dosha = product.get('dosha_type', '').upper()
            if dosha_filter not in product_dosha:
                return False

        # Status filter
        if 'status' in filters:
            if product.get('status') != filters['status']:
                return False

        # In stock filter
        if filters.get('in_stock', False):
            stock = product.get('stock', {})
            if not stock or stock.get('quantity', 0) <= 0:
                return False

        return True

    def get_similar_products(
        self,
        product_id: str,
        k: int = 10,
        category_boost: float = 0.1
    ) -> List[Dict]:
        """
        Find products similar to a given product

        Args:
            product_id: Source product ID
            k: Number of similar products to return
            category_boost: Boost for same-category products

        Returns:
            List of similar products
        """
        # Find product in index
        source_idx = None
        for idx, product in self.product_index.items():
            if product['id'] == product_id:
                source_idx = idx
                break

        if source_idx is None:
            raise ValueError(f"Product {product_id} not found in index")

        # Get product embedding
        product_embedding = self.index.reconstruct(source_idx)
        product_embedding = product_embedding.reshape(1, -1)

        # Search for similar products
        scores, indices = self.index.search(product_embedding, k + 1)  # +1 to exclude self

        # Format results
        results = []
        source_category = self.product_index[source_idx].get('category')

        for score, idx in zip(scores[0], indices[0]):
            if int(idx) == source_idx:  # Skip source product
                continue

            product = self.product_index[int(idx)]

            # Apply category boost
            adjusted_score = float(score)
            if source_category and product.get('category') == source_category:
                adjusted_score += category_boost

            results.append({
                'id': product['id'],
                'name': product['name'],
                'category': product.get('category'),
                'price': product.get('price'),
                'score': adjusted_score,
                'same_category': product.get('category') == source_category
            })

        # Re-sort by adjusted score
        results.sort(key=lambda x: x['score'], reverse=True)

        return results[:k]

    def save_index(self, path: str):
        """Save FAISS index to disk"""
        if self.index:
            faiss.write_index(self.index, path)
            logger.info(f"Index saved to {path}")

    def load_index(self, path: str):
        """Load FAISS index from disk"""
        self.index = faiss.read_index(path)
        logger.info(f"Index loaded from {path}")
