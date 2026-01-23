import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const GsapTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: "power2.out" },
      });

      tl.from(".box", { y: -100, opacity: 0 })
        .to(".box", { x: 100 })
        .to(".box", { rotation: 360 });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef}>
      <div
        className="box"
        style={{
          width: 100,
          height: 100,
          background: "tomato",
          margin: "50px auto",
        }}
      ></div>
    </div>
  );
};
