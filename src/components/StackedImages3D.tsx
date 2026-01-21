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

interface StackedImages3DProps {
  images: ImageData[];
  stackGap?: number;
  scaleReduction?: number;
}

export const StackedImages3D: React.FC<StackedImages3DProps> = ({
  images,
  stackGap = 60,
  scaleReduction = 0.04,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, index) => {
        if (!card) return;
        const cardsBelow = images.length - 1 - index;
        // Set initial stacked position
        if (index > 0) {
          gsap.set(card, {
            y: cardsBelow * stackGap,
            scale: 1 - scaleReduction * index,
            rotateX: -2,
          });
        }

        // Animate to full size when scrolling to this card
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotateX: 0,
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "top center",
            scrub: 1,
          },
        });

        // Animate away when scrolling past
        if (index < cards.length - 1) {
          gsap.to(card, {
            y: -stackGap,
            scale: 0.95,
            opacity: 0.7,
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top center",
              end: "top top+=100",
              scrub: 1,
            },
          });
        }
      });
    },
    {
      scope: containerRef,
      dependencies: [images, stackGap, scaleReduction],
    },
  );

  return (
    <div ref={containerRef} className="relative w-full py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="stack stack-bottom" style={{ perspective: "1000px" }}>
          {images.map((image, index) => (
            <div
              key={image.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="sticky top-32"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-base-100 mb-8">
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

                <div className="absolute inset-0 rounded-2xl ring-1 ring-base-300 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
