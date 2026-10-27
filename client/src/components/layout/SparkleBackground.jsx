import React, { useEffect, useState } from "react";

// 4-point Starburst SVG icon
const Starburst = ({ color = "#A3C997" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="h-full w-full drop-shadow-[0_0_8px_currentColor]"
    style={{ color }}
  >
    <path
      d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
      fill="currentColor"
    />
  </svg>
);

// Ambient background sparkles
const staticSparkles = [
  { left: "12%", top: "18%", delay: "0s", duration: "5s", size: "18px", type: "star", color: "#A3C997" },
  { left: "45%", top: "14%", delay: "1.2s", duration: "6.5s", size: "22px", type: "star", color: "#A3C997" },
  { left: "82%", top: "22%", delay: "0.8s", duration: "5.5s", size: "16px", type: "star", color: "#A3C997" },
  { left: "65%", top: "78%", delay: "2.1s", duration: "6s", size: "20px", type: "star", color: "#A3C997" },
  { left: "20%", top: "82%", delay: "1.5s", duration: "5.2s", size: "14px", type: "star", color: "#A3C997" },
  { left: "28%", top: "42%", delay: "2.4s", duration: "6s", size: "16px", type: "star", color: "#E89B84" },
  { left: "75%", top: "48%", delay: "0.5s", duration: "7s", size: "20px", type: "star", color: "#E89B84" },
  { left: "90%", top: "72%", delay: "1.8s", duration: "5.8s", size: "15px", type: "star", color: "#E89B84" },
  { left: "38%", top: "68%", delay: "3s", duration: "6.2s", size: "18px", type: "star", color: "#E89B84" },
  { left: "8%", top: "35%", delay: "0.2s", duration: "8s", size: "4px", type: "dot", color: "#A3C997" },
  { left: "55%", top: "30%", delay: "1.6s", duration: "9s", size: "3px", type: "dot", color: "#E89B84" },
  { left: "68%", top: "12%", delay: "2.8s", duration: "7.5s", size: "5px", type: "dot", color: "#A3C997" },
  { left: "15%", top: "62%", delay: "0.9s", duration: "8.5s", size: "3px", type: "dot", color: "#E89B84" },
  { left: "85%", top: "88%", delay: "3.2s", duration: "7s", size: "4px", type: "dot", color: "#A3C997" },
];

export default function SparkleBackground() {
  const [cursorSparkles, setCursorSparkles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Create a temporary sparkle at pointer coordinates
      const newSparkle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.floor(Math.random() * 12) + 12,
        color: Math.random() > 0.5 ? "#A3C997" : "#E89B84",
      };

      setCursorSparkles((prev) => [...prev.slice(-15), newSparkle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes sparkleStar {
          0% {
            opacity: 0;
            transform: scale(0.2) translateY(0px) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.25) translateY(-14px) rotate(45deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.2) translateY(-28px) rotate(90deg);
          }
        }

        @keyframes sparkleDot {
          0%, 100% {
            opacity: 0;
            transform: translateY(0px) scale(0.5);
          }
          40% {
            opacity: 0.8;
            transform: translateY(-12px) scale(1.3);
          }
          70% {
            opacity: 0.3;
            transform: translateY(-22px) scale(0.8);
          }
        }

        @keyframes cursorBurst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -60px) scale(1.4) rotate(90deg);
          }
        }

        .animate-sparkle-star {
          animation: sparkleStar infinite ease-in-out;
          will-change: transform, opacity;
        }

        .animate-sparkle-dot {
          animation: sparkleDot infinite ease-in-out;
          will-change: transform, opacity;
        }

        .animate-cursor-sparkle {
          animation: cursorBurst 0.9s forwards ease-out;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Background ambient lighting glows */}
      <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#A3C997]/10 blur-[130px]" />
      <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-[#E89B84]/10 blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 h-[400px] w-[400px] rounded-full bg-[#A3C997]/08 blur-[120px]" />

      {/* Ambient background sparkles */}
      {staticSparkles.map((sparkle, index) =>
        sparkle.type === "star" ? (
          <div
            key={index}
            className="absolute animate-sparkle-star"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration,
            }}
          >
            <Starburst color={sparkle.color} />
          </div>
        ) : (
          <span
            key={index}
            className="absolute rounded-full animate-sparkle-dot"
            style={{
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: sparkle.color,
              boxShadow: `0 0 10px ${sparkle.color}`,
              animationDelay: sparkle.delay,
              animationDuration: sparkle.duration,
            }}
          />
        )
      )}

      {/* Interactive cursor trail sparkles */}
      {cursorSparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-cursor-sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        >
          <Starburst color={sparkle.color} />
        </div>
      ))}
    </div>
  );
}