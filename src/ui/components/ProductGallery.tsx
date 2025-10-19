

"use client";

import { useState } from "react";

export function ProductGallery({ images }) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div>
      {/* Галерея */}
      <div className="flex
          sm:flex-row sm:overflow-x-auto sm:pb-3
          sm:w-[320px]">
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