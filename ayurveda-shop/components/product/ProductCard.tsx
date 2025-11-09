"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { productCard } from "@/lib/motion-variants";
import { cn, formatPrice, calculateDiscount } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewCount?: number;
  doshaType?: "vata" | "pitta" | "kapha" | "all";
  benefits?: string[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Implement add to cart functionality
    console.log("Added to cart:", product.id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.div
      variants={productCard}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            {/* Image */}
            <div className={cn("transition-opacity duration-300", imageLoaded ? "opacity-100" : "opacity-0")}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 via-primary-light/40 to-primary-light/20 animate-pulse" />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <motion.span
                  className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  NEW
                </motion.span>
              )}
              {product.isBestseller && (
                <motion.span
                  className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  BESTSELLER
                </motion.span>
              )}
              {discount > 0 && (
                <motion.span
                  className="px-3 py-1 bg-error text-white text-xs font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {discount}% OFF
                </motion.span>
              )}
            </div>

            {/* Quick Actions - Show on Hover */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                onClick={handleToggleWishlist}
                className={cn(
                  "p-2.5 rounded-full backdrop-blur-md transition-colors",
                  isWishlisted
                    ? "bg-error text-white"
                    : "bg-white/90 text-foreground hover:bg-error hover:text-white"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add to wishlist"
              >
                <Heart
                  className={cn("w-4 h-4", isWishlisted && "fill-current")}
                />
              </motion.button>

              <motion.button
                className="p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-primary hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Out of Stock</span>
              </div>
            )}

            {/* Add to Cart Button - Show on Hover */}
            {product.inStock && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ y: 100, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-5">
            {/* Category */}
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="font-serif font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-3">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating!)
                          ? "text-accent fill-current"
                          : "text-gray-300"
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                {product.reviewCount && (
                  <span className="text-xs text-text-muted ml-1">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
