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

interface StackedImagesProps {
  images: ImageData[];
  scaleReduction?: number;
}

export const StackedImages: React.FC<StackedImagesProps> = ({
  images,
  scaleReduction = 0.05,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean);

      // Each card (except the last) scales down and moves up
      // when the next card scrolls into view and stacks on top
      cards.forEach((card, index) => {
        if (index < cards.length - 1) {
          gsap.to(card, {
            scale: 1 - scaleReduction * (index + 1),
            y: -100 * (index + 1),
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: 1,
            },
          });
        }
      });
    },
    {
      scope: containerRef,
      dependencies: [images, scaleReduction],
    },
  );

  return (
    <div ref={containerRef} className="relative w-full py-20">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="sticky top-20"
            style={{ zIndex: index }}
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
