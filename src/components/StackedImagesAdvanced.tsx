import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ImageData {
  id: string;
  src: string;
  title: string;
  description?: string;
}

interface StackedImagesAdvancedProps {
  images: ImageData[];
  stackOffset?: number;
  scaleReduction?: number;
  rotationIntensity?: number;
}

export const StackedImagesAdvanced: React.FC<StackedImagesAdvancedProps> = ({
  images,
  stackOffset = 40,
  scaleReduction = 0.1,
  rotationIntensity = 2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Using useGSAP with context for better control and automatic cleanup
  const { contextSafe } = useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, index) => {
        const isNotLast = index < cards.length - 1;

        if (card && isNotLast) {
          // Stagger the rotation for visual interest
          const rotation = (index % 2 === 0 ? 1 : -1) * rotationIntensity;

          gsap.to(card, {
            scale: 1 - scaleReduction,
            opacity: 0.5,
            rotateZ: rotation,
            y: -stackOffset,
            scrollTrigger: {
              trigger: card,
              start: "top 100px",
              end: "bottom 100px",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    },
    {
      scope: containerRef,
      dependencies: [images, stackOffset, scaleReduction, rotationIntensity],
      // Revert on cleanup automatically handled by useGSAP
    },
  );

  // Example of using contextSafe for event handlers
  const handleCardHover = contextSafe((index: number) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });

  const handleCardLeave = contextSafe((index: number) => {
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });

  return (
    <div ref={containerRef} className="relative w-full py-20">
      <div className="max-w-4xl mx-auto px-6">
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="stacked-card sticky top-20 mb-8"
            style={{ zIndex: images.length - index }}
            onMouseEnter={() => handleCardHover(index)}
            onMouseLeave={() => handleCardLeave(index)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-bold mb-2 tracking-tight">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-white/90 max-w-2xl leading-relaxed">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
