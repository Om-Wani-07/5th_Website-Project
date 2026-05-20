import React, { useEffect, useRef, useState } from 'react';
import { MotionValue, useTransform } from 'framer-motion';

// Vite compile-time glob to detect all frames and their paths automatically.
// We sort keys to ensure sequential ordering (e.g. frame-001.jpg -> frame-100.jpg).
const frameModules = import.meta.glob('../../Matcha Latte JPG images/*.jpg', { eager: true });
const framePaths = Object.keys(frameModules)
  .sort()
  .map((key) => (frameModules[key] as any).default || frameModules[key]);

interface MatchaSequenceProps {
  scrollYProgress: MotionValue<number>;
}

export const MatchaSequence: React.FC<MatchaSequenceProps> = ({ scrollYProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const totalFrames = framePaths.length;
  const lastDrawnFrameRef = useRef<number>(-1);

  // Preload all frames
  useEffect(() => {
    if (totalFrames === 0) {
      setErrorOccurred(true);
      setIsLoading(false);
      return;
    }

    const loadedImages: HTMLImageElement[] = [];
    let count = 0;

    framePaths.forEach((path, index) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        count++;
        setLoadedCount(count);
        if (count === totalFrames) {
          setImages(loadedImages);
          setIsLoading(false);
        }
      };
      loadedImages[index] = img;
    });
  }, [totalFrames]);

  // Map parent scrollYProgress [0, 1] to frame index [0, totalFrames - 1]
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, totalFrames - 1)]);

  // Render loop hook
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      const rawVal = frameIndex.get();
      // Clamp between 0 and totalFrames - 1
      const index = Math.min(Math.max(0, Math.floor(rawVal)), Math.max(0, totalFrames - 1));

      if (index !== lastDrawnFrameRef.current) {
        const img = images[index];
        if (img && img.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw with fitted aspect ratio (cover/center)
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const imgWidth = img.width;
          const imgHeight = img.height;
          
          const imgRatio = imgWidth / imgHeight;
          const canvasRatio = canvasWidth / canvasHeight;
          
          let drawWidth = canvasWidth;
          let drawHeight = canvasHeight;
          let offsetX = 0;
          let offsetY = 0;
          
          if (imgRatio > canvasRatio) {
            drawWidth = canvasHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
          } else {
            drawHeight = canvasWidth / imgRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
          }
          
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          lastDrawnFrameRef.current = index;
        }
      }
    };

    // Subscribing to scroll frame changes
    const unsubscribe = frameIndex.on('change', () => {
      requestAnimationFrame(drawFrame);
    });

    // Initial render
    drawFrame();

    return () => unsubscribe();
  }, [images, isLoading, totalFrames, frameIndex]);

  // Adjust canvas size to match layout and scale for Retina screens
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Force redraw
      lastDrawnFrameRef.current = -1;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Redraw current frame immediately
        const rawVal = frameIndex.get();
        const index = Math.min(Math.max(0, Math.floor(rawVal)), Math.max(0, totalFrames - 1));
        const img = images[index];
        if (img && img.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const imgWidth = img.width;
          const imgHeight = img.height;
          const imgRatio = imgWidth / imgHeight;
          const canvasRatio = canvasWidth / canvasHeight;
          
          let drawWidth = canvasWidth;
          let drawHeight = canvasHeight;
          let offsetX = 0;
          let offsetY = 0;
          
          if (imgRatio > canvasRatio) {
            drawWidth = canvasHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
          } else {
            drawHeight = canvasWidth / imgRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
          }
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, totalFrames, frameIndex]);

  return (
    <div className="matcha-sequence-container">
      {isLoading && (
        <div className="matcha-sequence-loader">
          <div className="sequence-spinner"></div>
          <span>Brewing Ritual... {Math.floor((loadedCount / (totalFrames || 1)) * 100)}%</span>
        </div>
      )}
      {errorOccurred && (
        <div className="matcha-sequence-error">
          <span>Failed to detect Matcha sequence frames.</span>
        </div>
      )}
      <canvas ref={canvasRef} className="matcha-sequence-canvas" />
    </div>
  );
};

