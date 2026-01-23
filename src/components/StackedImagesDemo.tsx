import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const StackedImages = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const images = gsap.utils.toArray<HTMLElement>(".stacked-img");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000", // adjust based on number of images
          scrub: true,
          pin: true,
        },
      });

      images.forEach((img, i) => {
        tl.fromTo(
          img,
          { yPercent: 100 },
          { yPercent: 0, ease: "none" },
          i * 0.5, // stagger by timeline position, not stagger prop
        );
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} style={{ height: "100vh", position: "relative" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <img
            key={i}
            className="stacked-img"
            src={`https://picsum.dev/600/400?seed=${i}`}
            alt={`Stack ${i + 1}`}
            style={{
              width: "600px",
              height: "400px",
              marginTop: i === 0 ? 0 : "-300px", // overlap a bit
              zIndex: 10 + i,
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
