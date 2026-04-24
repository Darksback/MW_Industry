"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
}

export default function AnnouncementBar({ announcements }: { announcements: Announcement[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (announcements.length === 0) return null;

  const current = announcements[index];

  const next = () => setIndex((prev) => (prev + 1) % announcements.length);
  const prev = () => setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <div className="bg-white border-b border-[#e5e2d9] py-1.5 px-4 relative">
      <div className="container mx-auto flex items-center justify-center min-h-[28px]">
        <div className="flex items-center gap-4">
          {announcements.length > 1 && (
            <button 
              onClick={prev}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}

          <div className="flex items-center justify-center overflow-hidden max-w-[80vw] sm:max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-center"
              >
                <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] sm:text-[13px] font-medium text-gray-800">
                  {current.title && (
                    <span className="font-bold whitespace-nowrap">
                      {current.title}
                    </span>
                  )}
                  
                  {current.title && current.subtitle && (
                    <span className="hidden sm:inline opacity-30">|</span>
                  )}
                  
                  {current.subtitle && (
                    <span className="opacity-90">
                      {current.subtitle}
                    </span>
                  )}
                </div>

                {current.button_text && current.button_link && (
                  <Link 
                    href={current.button_link}
                    className="text-[11px] sm:text-[13px] font-bold text-[#006fcf] hover:underline whitespace-nowrap"
                  >
                    {current.button_text}
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {announcements.length > 1 && (
            <button 
              onClick={next}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
