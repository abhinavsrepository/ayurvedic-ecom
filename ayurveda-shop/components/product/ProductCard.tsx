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
  shortDescription?: string;
  longDescription?: string;
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
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ingredients?: string[] | string;
  howToUse?: string[] | string;
  warnings?: string[] | string;
  shelfLife?: string;
  madeIn?: string;
  certifications?: string[];
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
      className="group h-full"
    >
      <Link href={`/product/${product.slug}`} className="block h-full">
        <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>

            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 via-primary-light/40 to-primary-light/20 animate-pulse" />
            )}

            {/* Badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
              {product.isNew && (
                <motion.span
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-accent text-white text-[10px] sm:text-xs font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  NEW
                </motion.span>
              )}
              {product.isBestseller && (
                <motion.span
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-white text-[10px] sm:text-xs font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  BESTSELLER
                </motion.span>
              )}
              {discount > 0 && (
                <motion.span
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-error text-white text-[10px] sm:text-xs font-semibold rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {discount}% OFF
                </motion.span>
              )}
            </div>

            {/* Quick Actions - Show on Hover (Desktop) / Always on Mobile */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                onClick={handleToggleWishlist}
                className={cn(
                  "p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-colors tap-target",
                  isWishlisted
                    ? "bg-error text-white"
                    : "bg-white/90 text-foreground hover:bg-error hover:text-white"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Add to wishlist"
              >
                <Heart
                  className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isWishlisted && "fill-current")}
                />
              </motion.button>

              <motion.button
                className="p-2 sm:p-2.5 bg-white/90 backdrop-blur-md rounded-full hover:bg-primary hover:text-white transition-colors tap-target"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Quick view"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
            </div>

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold text-sm sm:text-lg">Out of Stock</span>
              </div>
            )}

            {/* Add to Cart Button - Show on Hover (Desktop) */}
            {product.inStock && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 hidden sm:block"
                initial={{ y: 100, opacity: 0 }}
                whileHover={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 sm:py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
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
          <div className="p-3 sm:p-5 flex-1 flex flex-col">
            {/* Category */}
            <p className="text-[10px] sm:text-xs text-text-muted uppercase tracking-wider mb-1 sm:mb-2">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="font-serif font-semibold text-base sm:text-lg text-foreground mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-2 sm:mb-3 flex-1">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-2 sm:mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        "w-3 h-3 sm:w-4 sm:h-4",
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
                  <span className="text-[10px] sm:text-xs text-text-muted ml-1">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 mt-auto">
              <span className="text-lg sm:text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Mobile Add to Cart Button */}
            {product.inStock && (
              <motion.button
                onClick={handleAddToCart}
                className="w-full mt-3 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm sm:hidden tap-target"
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </motion.button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
