import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample review data - replace with your actual data
const reviewsData = [
  {
    id: 1,
    image: "", // Add your image URL here
    name: "Sarah Mitchell",
    role: "CEO, TechVision",
    placeholder:
      '"Absolutely transformed our business. The attention to detail and professionalism exceeded all expectations."',
  },
  {
    id: 2,
    image: "",
    name: "James Chen",
    role: "Director, Digital Solutions",
    placeholder:
      '"Outstanding service from start to finish. Highly recommend to anyone looking for excellence."',
  },
  {
    id: 3,
    image: "",
    name: "Emma Thompson",
    role: "Founder, Creative Studio",
    placeholder:
      '"The best decision we made this year. Results speak for themselves - simply phenomenal work."',
  },
  {
    id: 4,
    image: "",
    name: "Michael Rodriguez",
    role: "VP Marketing, GrowthLab",
    placeholder:
      '"Professional, efficient, and genuinely cares about client success. A true partner in growth."',
  },
  {
    id: 5,
    image: "",
    name: "Lisa Anderson",
    role: "Product Lead, Innovate Inc",
    placeholder:
      '"Exceeded our goals by 150%. The strategic approach and execution were flawless throughout."',
  },
];

// Placeholder component for demo
const PlaceholderImage = ({ quote }) => (
  <div className="placeholder-img">
    <div className="stars">★★★★★</div>
    <div className="quote">{quote}</div>
  </div>
);

// Individual review card component
const ReviewCard = ({ review, index, currentIndex, onClick }) => {
  const diff = index - currentIndex;
  const absDiff = Math.abs(diff);
  const isActive = index === currentIndex;

  // Calculate position for 3D stacked effect
  const baseSpread = 180;
  const depthSpread = 30;
  const rotationFactor = 8;

  const x = diff * baseSpread;
  const z = -absDiff * depthSpread;
  const rotation =
    diff * rotationFactor + (diff !== 0 ? Math.sin(index * 2.5) * 5 : 0);
  const scale = 1 - absDiff * 0.12;

  return (
    <motion.div
      className={`review-card ${isActive ? "active" : ""}`}
      onClick={() => onClick(index)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        x,
        rotateZ: rotation,
        scale,
        filter: isActive
          ? "brightness(1) saturate(1)"
          : "brightness(0.7) saturate(0.6)",
        zIndex: reviewsData.length - absDiff,
      }}
      whileHover={
        !isActive
          ? {
              filter: "brightness(0.85) saturate(0.8)",
              scale: scale * 1.02,
            }
          : {}
      }
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        mass: 1,
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${z}px)`,
      }}
    >
      <div className="card-inner">
        {review.image ? (
          <img src={review.image} alt={review.name} className="card-image" />
        ) : (
          <PlaceholderImage quote={review.placeholder} />
        )}

        <AnimatePresence>
          {isActive && (
            <motion.div
              className="card-overlay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="client-name">{review.name}</div>
              <div className="client-role">{review.role}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Main gallery component
export const ReviewGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + reviewsData.length) % reviewsData.length,
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex(
          (prev) => (prev - 1 + reviewsData.length) % reviewsData.length,
        );
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Optional: Auto-advance
  // useEffect(() => {
  //   const interval = setInterval(nextSlide, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="review-gallery-wrapper">
      <style jsx>{`
        .review-gallery-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0e13 0%, #151921 100%);
          color: #f5f5f0;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        .review-gallery-wrapper::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            radial-gradient(
              circle at 20% 30%,
              rgba(212, 175, 55, 0.03) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(200, 150, 102, 0.03) 0%,
              transparent 50%
            );
          pointer-events: none;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .header {
          text-align: center;
          margin-bottom: 100px;
        }

        .title {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(3rem, 8vw, 5rem);
          font-weight: 300;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #d4af37, #c89666);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #9ba3af;
          font-weight: 300;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .gallery-section {
          perspective: 2000px;
          min-height: 800px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .gallery-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          height: 700px;
          margin: 0 auto;
        }

        .review-card {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 340px;
          height: 600px;
          transform: translate(-50%, -50%);
          transform-origin: center center;
          cursor: pointer;
          transition: filter 0.3s ease;
        }

        .review-card.active {
          cursor: default;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1a1f2e 0%, #252b3a 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .review-card.active .card-inner {
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.5),
            0 0 0 1px #d4af37,
            0 0 60px rgba(212, 175, 55, 0.15);
        }

        .card-inner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.05) 0%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }

        .review-card.active .card-inner::before {
          opacity: 1;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .placeholder-img {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: #9ba3af;
          font-size: 0.9rem;
          text-align: center;
          padding: 40px;
          line-height: 1.8;
        }

        .placeholder-img .quote {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.3rem;
          font-style: italic;
          color: #f5f5f0;
          margin-bottom: 20px;
        }

        .placeholder-img .stars {
          color: #d4af37;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30px;
          background: linear-gradient(
            to top,
            rgba(10, 14, 19, 0.95) 0%,
            transparent 100%
          );
        }

        .client-name {
          font-family: "Cormorant Garamond", serif;
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 5px;
          color: #d4af37;
        }

        .client-role {
          font-size: 0.9rem;
          color: #9ba3af;
          letter-spacing: 0.05em;
        }

        .navigation {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 101;
        }

        .nav-btn {
          width: 50px;
          height: 50px;
          border: 1px solid #d4af37;
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          z-index: 102;
        }

        .nav-btn:hover {
          background: #d4af37;
          color: #0a0e13;
          transform: scale(1.1);
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15);
        }

        .nav-btn:active {
          transform: scale(0.95);
        }

        .dots {
          position: absolute;
          bottom: -160px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 101;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          z-index: 102;
        }

        .dot.active {
          background: #d4af37;
          transform: scale(1.3);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
        }

        .dot:hover {
          background: #c89666;
          transform: scale(1.2);
        }

        .dot:active {
          transform: scale(0.9);
        }

        @media (max-width: 768px) {
          .review-gallery-wrapper {
            padding: 60px 20px;
          }

          .gallery-container {
            height: 600px;
          }

          .review-card {
            width: 280px;
            height: 500px;
          }

          .navigation {
            bottom: -60px;
          }

          .nav-btn {
            width: 44px;
            height: 44px;
          }

          .dots {
            bottom: -120px;
          }
        }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Work+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <div className="container">
        <motion.header
          className="header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="title">Client Testimonials</h1>
          <p className="subtitle">Trusted by Leading Brands</p>
        </motion.header>

        <div className="gallery-section">
          <div className="gallery-container">
            {reviewsData.map((review, index) => (
              <ReviewCard
                key={review.id}
                review={review}
                index={index}
                currentIndex={currentIndex}
                onClick={goToSlide}
              />
            ))}
          </div>

          <div className="navigation">
            <motion.button
              className="nav-btn"
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              className="nav-btn"
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          <div className="dots">
            {reviewsData.map((_, index) => (
              <motion.div
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
