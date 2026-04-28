
"use client";

import { useState, useEffect, useRef } from "react";

export function ProductGallery({ images }: { images: Array<{ url: string; alt?: string | null }> }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentScroll, setCurrentScroll] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setCurrentScroll(index);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: el.offsetWidth * index, behavior: "smooth" });
  };

  return (
    <div>
      {/* Галерея */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-3 overflow-x-auto snap-x snap-mandatory pb-4 w-full sm:grid sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:pb-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={img.alt || ""}
            onClick={() => setActiveIndex(index)}
            className={`snap-start shrink-0 w-full h-[450px] object-cover rounded-md cursor-pointer transition-transform duration-300 hover:scale-105 sm:w-full sm:h-48 sm:snap-none ${
              index === 0 ? "sm:hidden" : ""
            }`}
          />
        ))}
      </div>

      {/* Dot-індикатори — тільки мобільний, тільки якщо більше 1 фото */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-2 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              aria-label={`Фото ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentScroll === index
                  ? "w-5 bg-neutral-900"
                  : "w-2 bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Модальне вікно */}
      {activeIndex !== null && (
        <div
          onClick={() => setActiveIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl z-50 p-2"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(null);
            }}
          >
            &times;
          </button>

          {activeIndex > 0 && (
            <button
              className="absolute left-2 sm:left-8 text-white text-4xl z-50 p-4 select-none"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(activeIndex - 1);
              }}
            >
              &#10094;
            </button>
          )}

          <img
            src={images[activeIndex].url}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          {activeIndex < images.length - 1 && (
            <button
              className="absolute right-2 sm:right-8 text-white text-4xl z-50 p-4 select-none"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(activeIndex + 1);
              }}
            >
              &#10095;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
