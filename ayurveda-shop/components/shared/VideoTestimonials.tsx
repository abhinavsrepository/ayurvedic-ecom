"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-variants";
import { useInView } from "react-intersection-observer";

interface VideoTestimonial {
  id: string;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  customerName: string;
  rating: number;
}

interface VideoTestimonialsProps {
  videos: VideoTestimonial[];
  title?: string;
  subtitle?: string;
}

export default function VideoTestimonials({
  videos,
  title = "What People Say About Our Products!",
  subtitle = "Real customers, real results, real stories",
}: VideoTestimonialsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set(videos.map(v => v.id)));

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const toggleMute = (videoId: string) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleVideoClick = (videoId: string) => {
    setPlayingVideo(videoId === playingVideo ? null : videoId);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Video Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="hidden md:block">
            <motion.button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white shadow-xl rounded-full hover:bg-primary hover:text-white transition-colors -ml-6"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white shadow-xl rounded-full hover:bg-primary hover:text-white transition-colors -mr-6"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Video Grid Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                mutedVideos={mutedVideos}
                toggleMute={toggleMute}
              />
            ))}
          </div>
        </div>

        {/* Mobile Scroll Hint */}
        <motion.p
          className="text-center text-text-muted mt-6 md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          👉 Swipe to see more reviews
        </motion.p>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

// Separate VideoCard component with auto-play
function VideoCard({
  video,
  index,
  mutedVideos,
  toggleMute,
}: {
  video: VideoTestimonial;
  index: number;
  mutedVideos: Set<string>;
  toggleMute: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Auto-play when in view
  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch(() => {
          // Auto-play might be blocked, user needs to interact
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      className="flex-shrink-0 w-80 snap-start"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
        {/* Video Container */}
        <div className="relative aspect-[9/16] bg-gradient-to-br from-primary-light/20 to-accent/20 overflow-hidden">
          {/* Auto-playing Video */}
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnail}
            className="w-full h-full object-cover"
            loop
            muted={mutedVideos.has(video.id)}
            playsInline
            controls={false}
          />

          {/* Mute/Unmute Button */}
          <motion.button
            onClick={() => toggleMute(video.id)}
            className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={mutedVideos.has(video.id) ? "Unmute" : "Mute"}
          >
            {mutedVideos.has(video.id) ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </motion.button>

          {/* Caption Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <p className="text-white font-semibold text-lg mb-2">
              {video.caption}
            </p>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground text-lg">
                {video.customerName}
              </h4>
              {/* Star Rating */}
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < video.rating
                        ? "text-accent fill-current"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Verified Badge */}
            <div className="flex items-center gap-1 text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
