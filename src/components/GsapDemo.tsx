import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const cardStyle = {
  margin: "24px 0",
  padding: 24,
  border: "1px solid #ddd",
  borderRadius: 12,
};
export const GsapDemo = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      // target elements inside this component only
      gsap.utils.toArray(".card").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    },
    { scope: root }, // important: scopes selectors + cleanup
  );

  return (
    <section ref={root} style={{ padding: 24 }}>
      <h2>Scroll down</h2>

      <div style={{ height: 500 }} />

      <div className="card" style={cardStyle}>
        Card 1
      </div>
      <div className="card" style={cardStyle}>
        Card 2
      </div>
      <div className="card" style={cardStyle}>
        Card 3
      </div>

      <div style={{ height: 600 }} />
    </section>
  );
};
