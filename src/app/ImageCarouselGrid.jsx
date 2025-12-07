"use client";
import { useEffect, useState } from "react";

const imageSets = [
  ["/1a.jpg", "/1b.jpg", "/1c.jpg"],
  ["/2a.jpg", "/2b.jpg", "/2c.jpg"],
  ["/3a.jpg", "/3b.jpg", "/3c.jpg"],
];

const TRANSITION_DURATION = 800;
const DISPLAY_DURATION = 3000;
const CASCADE_DELAY = 600;

export default function ImageCarouselGrid() {
  return (
    <div className="flex justify-center gap-4 w-full max-w-5xl mx-auto">
      {imageSets.map((set, i) => (
        <CascadeBlock key={i} images={set} delay={i * CASCADE_DELAY} />
      ))}
    </div>
  );
}

function CascadeBlock({ images, delay }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timers = {
      timeout: null,
      interval: null,
    };

    timers.timeout = setTimeout(() => {
      timers.interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length);
          setIsTransitioning(false);
        }, TRANSITION_DURATION / 2);
      }, DISPLAY_DURATION + TRANSITION_DURATION);
    }, delay);

    return () => {
      clearTimeout(timers.timeout);
      clearInterval(timers.interval);
    };
  }, [delay, images.length]);

  return (
    <div className="relative w-full aspect-[16/9] max-w-[180px] rounded-md overflow-hidden shadow-lg">
      <img
        loading="lazy"
        src={images[currentIndex]}
        alt={`img-${currentIndex}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
