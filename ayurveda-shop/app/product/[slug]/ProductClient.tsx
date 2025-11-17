'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import type { ProductResponse } from '@/lib/api/schemas';

interface ProductClientProps {
  product: ProductResponse;
  discount: number;
}

export default function ProductClient({ product, discount }: ProductClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!product || product.stockQuantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice || product.price,
      image: product.images[0]?.url || '/placeholder.png',
      quantity: quantity,
    });

    toast.success('Added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (!product || product.stockQuantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.compareAtPrice || product.price,
      image: product.images[0]?.url || '/placeholder.png',
      quantity: quantity,
    });

    router.push('/checkout');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
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
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
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
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          )}
          {product.lowStock && product.stockQuantity > 0 && (
            <span className="text-sm text-yellow-600 font-medium">Low Stock</span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
        {product.shortDescription && (
          <p className="text-gray-600 text-lg">{product.shortDescription}</p>
        )}
      </div>

      {/* Rating - Placeholder for now */}
      <div className="flex items-center space-x-4 pb-6 border-b">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold">4.0</span>
        <span className="text-gray-600">(0 reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-4">
        <span className="text-4xl font-bold text-gray-900">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className="text-2xl text-gray-400 line-through">
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-lg text-green-600 font-semibold">Save {discount}%</span>
          </>
        )}
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Quantity:</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-green-600 flex items-center justify-center font-semibold"
            disabled={product.stockQuantity <= 0}
          >
            -
          </button>
          <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
            className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-green-600 flex items-center justify-center font-semibold"
            disabled={product.stockQuantity <= 0}
          >
            +
          </button>
        </div>
        {product.stockQuantity > 0 && quantity >= product.stockQuantity && (
          <p className="text-sm text-yellow-600">Maximum available quantity reached</p>
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
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-gray-300 hover:border-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
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
    </div>
  );
}
