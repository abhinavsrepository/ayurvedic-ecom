"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ThumbsUp,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { reviewsApi, type ReviewStats, type Review } from "@/lib/api/reviews";
import type { ProductResponse } from "@/lib/api/schemas";

interface ProductClientProps {
  product: ProductResponse;
  discount: number;
}

export default function ProductClient({
  product,
  discount,
}: ProductClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [ratingStats, setRatingStats] = useState<ReviewStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    loadRatingStats();
    loadReviews();
  }, [product.id]);

  const loadRatingStats = async () => {
    try {
      const stats = await reviewsApi.getProductRatingStats(product.id);
      setRatingStats(stats);
    } catch (error) {
      console.error("Failed to load rating stats:", error);
    }
  };

  const loadReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const response = await reviewsApi.getProductReviews(product.id, {
        page: 0,
        size: showAllReviews ? 10 : 3,
        sortBy: "recent",
      });
      setReviews(response.reviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const renderStars = (rating: number, size = "w-5 h-5") => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await reviewsApi.markHelpful(reviewId);
      toast.success("Thanks for your feedback!");
      loadReviews();
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
      toast.error("Failed to update helpful vote");
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice || product.price,
      image: product.images[0]?.url || "/placeholder.png",
      quantity: quantity,
    });

    toast.success("Added to cart successfully!");
  };

  const handleBuyNow = () => {
    if (!product || product.stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice || product.price,
      image: product.images[0]?.url || "/placeholder.png",
      quantity: quantity,
    });

    router.push("/checkout");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          {product.category && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {product.category}
            </span>
          )}
          {product.stockQuantity > 0 ? (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">
              Out of Stock
            </span>
          )}
          {product.lowStock && product.stockQuantity > 0 && (
            <span className="text-sm text-yellow-600 font-medium">
              Low Stock
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {product.name}
        </h1>
        {product.shortDescription && (
          <p className="text-gray-600 text-lg">{product.shortDescription}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-4 pb-6 border-b">
        {ratingStats ? (
          <>
            {renderStars(ratingStats.averageRating)}
            <span className="text-lg font-semibold">
              {ratingStats.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-600">
              ({ratingStats.totalReviews} reviews)
            </span>
          </>
        ) : (
          <>
            {renderStars(0)}
            <span className="text-lg font-semibold">0.0</span>
            <span className="text-gray-600">(No reviews yet)</span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-4">
        <span className="text-4xl font-bold text-gray-900">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price ? (
          <>
            <span className="text-2xl text-gray-400 line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-lg text-green-600 font-semibold">
              Save {discount}%
            </span>
          </>
        ) : null}
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">
          Quantity:
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-green-600 flex items-center justify-center font-semibold"
            disabled={product.stockQuantity <= 0}
          >
            -
          </button>
          <span className="text-xl font-semibold w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stockQuantity, quantity + 1))
            }
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-green-600 flex items-center justify-center font-semibold"
            disabled={product.stockQuantity <= 0}
          >
            +
          </button>
        </div>
        {product.stockQuantity > 0 && quantity >= product.stockQuantity && (
          <p className="text-sm text-yellow-600">
            Maximum available quantity reached
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleBuyNow}
          disabled={product.stockQuantity <= 0}
          className="w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity <= 0}
          className="w-full py-4 bg-white border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center space-x-2 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWishlist}
            className={`py-3 border-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              isWishlisted
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-300 hover:border-red-400"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`}
            />
            <span>Wishlist</span>
          </button>
          <button
            onClick={handleShare}
            className="py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-green-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="pt-6 border-t">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h3>

        {isLoadingReviews ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 rounded-lg p-6 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-gray-900">
                        {review.author.name}
                      </span>
                      {review.isVerified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating, "w-4 h-4")}
                      <span className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                </div>

                {review.title && (
                  <h4 className="font-semibold text-gray-900">
                    {review.title}
                  </h4>
                )}

                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}

            {ratingStats && ratingStats.totalReviews > 3 && !showAllReviews && (
              <button
                onClick={() => {
                  setShowAllReviews(true);
                  loadReviews();
                }}
                className="w-full py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>View All {ratingStats.totalReviews} Reviews</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-4">
              No reviews yet. Be the first to review this product!
            </p>
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              Write a Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
