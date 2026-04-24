"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  title: string | null;
  headline: string | null;
  button_text: string | null;
  button_link: string | null;
  image_url: string | null;
  bg_color: string | null;
}

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [extractedColors, setExtractedColors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Extract color from image when a slide has an image
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.image_url && !extractedColors[slide.id]) {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = slide.image_url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = 1;
          canvas.height = 1;
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          
          // Make the color very soft and desaturated for a premium background feel
          const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
          const factor = hsp > 200 ? 0.95 : 0.98; // Lighter if image is dark, etc.
          
          // Convert to a very soft pastel version
          const softR = Math.floor(r + (255 - r) * 0.9);
          const softG = Math.floor(g + (255 - g) * 0.9);
          const softB = Math.floor(b + (255 - b) * 0.9);
          
          setExtractedColors((prev) => ({
            ...prev,
            [slide.id]: `rgb(${softR}, ${softG}, ${softB})`,
          }));
        };
      }
    });
  }, [slides, extractedColors]);

  if (slides.length === 0) return null;

  const current = slides[index];
  const dynamicBg = extractedColors[current.id] || current.bg_color || "#f5f5f5";

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      className="relative w-full py-8 md:py-12 transition-colors duration-1000"
      style={{ backgroundColor: dynamicBg }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[500px] md:h-[650px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-white/40 backdrop-blur-sm border border-white/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image/Color */}
              {current.image_url ? (
                <div className="absolute inset-0">
                  <Image 
                    src={current.image_url} 
                    alt={current.headline || "Hero background"} 
                    fill 
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent lg:from-white/70" />
                </div>
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: current.bg_color || "#f5f5f5" }} />
              )}

              {/* Content Overlay */}
              <div className="relative h-full container mx-auto px-8 md:px-20 flex flex-col justify-center items-start z-10">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="max-w-xl space-y-4 md:space-y-6"
                >
                  {current.title && (
                    <span className="text-[#5cb2e1] font-bold text-lg md:text-xl tracking-tight block">
                      {current.title}
                    </span>
                  )}
                  <h1 className="text-4xl md:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                    {current.headline}
                  </h1>
                  
                  {current.button_text && current.button_link && (
                    <div className="pt-4">
                      <Link href={current.button_link}>
                        <Button 
                          size="lg" 
                          className="h-14 md:h-16 px-10 md:px-12 text-base md:text-lg rounded-full bg-[#5cb2e1] hover:bg-[#4a9fcb] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                          {current.button_text}
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Pagination Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-10 right-10 flex items-center gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    i === index ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white"
                  )}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/40 transition-colors z-20 hidden md:flex"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/40 transition-colors z-20 hidden md:flex"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
