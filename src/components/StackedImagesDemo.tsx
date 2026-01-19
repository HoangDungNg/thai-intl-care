import React from "react";
import { useSpring, animated, config } from "@react-spring/web";

interface ImageData {
  id: string;
  src: string;
  title: string;
  description?: string;
}

interface StackedImagesProps {
  images: ImageData[];
  stackOffset?: number;
  scaleReduction?: number;
}

export const StackedImages: React.FC<StackedImagesProps> = ({
  images,
  stackOffset = 40,
  scaleReduction = 0.05,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerTop = container.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      const startPoint = windowHeight;
      const endPoint = -container.offsetHeight;
      const scrollRange = startPoint - endPoint;
      const currentScroll = startPoint - containerTop;

      const progress = Math.max(0, Math.min(1, currentScroll / scrollRange));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">
        {images.map((image, index) => (
          <StackedImageCard
            key={image.id}
            image={image}
            index={index}
            totalImages={images.length}
            scrollProgress={scrollProgress}
            stackOffset={stackOffset}
            scaleReduction={scaleReduction}
          />
        ))}
      </div>
    </div>
  );
};

interface StackedImageCardProps {
  image: ImageData;
  index: number;
  totalImages: number;
  scrollProgress: number;
  stackOffset: number;
  scaleReduction: number;
}

const StackedImageCard: React.FC<StackedImageCardProps> = ({
  image,
  index,
  totalImages,
  scrollProgress,
  stackOffset,
  scaleReduction,
}) => {
  const startProgress = index / totalImages;
  const endProgress = (index + 1) / totalImages;

  const cardProgress = Math.max(
    0,
    Math.min(
      1,
      (scrollProgress - startProgress) / (endProgress - startProgress),
    ),
  );

  const currentOffset = stackOffset * (totalImages - 1 - index);
  const targetOffset = stackOffset * index;
  const yOffset = currentOffset - (currentOffset - targetOffset) * cardProgress;

  const initialScale = 1 - scaleReduction * (totalImages - 1 - index);
  const targetScale = 1;
  const scale = initialScale + (targetScale - initialScale) * cardProgress;

  const springProps = useSpring({
    transform: `translateY(${yOffset}px) scale(${scale})`,
    opacity: 0.4 + cardProgress * 0.6,
    config: config.gentle,
  });

  return (
    <animated.div style={springProps} className="sticky top-20 mb-8">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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
    </animated.div>
  );
};
