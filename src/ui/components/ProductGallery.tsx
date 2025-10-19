

"use client";

import { useState, useEffect } from "react";

export function ProductGallery({ images }: { images: Array<{ url: string; alt?: string }> }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  



      useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      {/* Галерея */}
      <div
  className="
    flex flex-col gap-2
    sm:flex-row sm:space-x-3 sm:overflow-x-auto sm:pb-3 sm:w-[320px]
  "
>
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={img.alt || ""}
            onClick={() => setActiveImage(img.url)}
            className={`object-cover rounded-md cursor-pointer transition-transform duration-300 hover:scale-105
              ${index === 0 ? "col-span-2 h-48" : "h-48"}`}
          />
        ))}
      </div>

      {/* Модальне вікно */}
      {activeImage && (
        
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >

        <button
        className="absolute top-4 right-4 text-white text-2xl z-50"
        onClick={(e) => {
            e.stopPropagation(); // щоб клік по кнопці не закривав фон
            setActiveImage(null);
        }}
        >
        ×
        </button>

          <img
            src={activeImage}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg transition-all duration-300"
          />
        </div>
      )}
    </div>
  );
}