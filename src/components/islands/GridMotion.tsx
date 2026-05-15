import { useRef } from "react";

interface GridMotionProps {
  images: { src: string; alt: string }[];
  rows?: number;
  speed?: number;
  gap?: number;
}

export default function GridMotion({ images, rows = 3, speed = 35, gap = 6 }: GridMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Distribute images across rows evenly
  const rowsData: { src: string; alt: string }[][] = [];
  for (let r = 0; r < rows; r++) {
    rowsData.push([]);
  }
  for (const [i, img] of images.entries()) {
    rowsData[i % rows].push(img);
  }

  // Duplicate images in each row until we have enough for seamless loop
  for (const row of rowsData) {
    const originalLength = row.length;
    if (originalLength === 0) continue;
    while (row.length < 10) {
      row.push(...row.slice(0, originalLength));
    }
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Top gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #b9e4eb, transparent)" }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #b9e4eb, transparent)" }}
      />

      {/* Left gradient fade */}
      <div
        className="absolute top-0 left-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #b9e4eb, transparent)" }}
      />

      {/* Right gradient fade */}
      <div
        className="absolute top-0 right-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #b9e4eb, transparent)" }}
      />

      {/* Grid rows */}
      <div className="flex flex-col" style={{ gap: `${gap}px` }}>
        {rowsData.map((row, rowIndex) => {
          const isEven = rowIndex % 2 === 0;
          const duration = speed + rowIndex * 3;
          const rowKeys = [
            "motion-row-0",
            "motion-row-1",
            "motion-row-2",
            "motion-row-3",
            "motion-row-4",
          ];

          return (
            <div
              key={rowKeys[rowIndex] || `motion-row-${rowIndex}`}
              className="flex"
              style={{
                gap: `${gap}px`,
                animation: `${isEven ? "gridMoveRight" : "gridMoveLeft"} ${duration}s linear infinite`,
                width: "max-content",
              }}
            >
              {/* First set */}
              {row.map((img, i) => (
                <div
                  key={`${img.src}-a-${i}`}
                  className="flex-shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] overflow-hidden rounded-lg"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {row.map((img, i) => (
                <div
                  key={`${img.src}-b-${i}`}
                  className="flex-shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px] lg:w-[240px] lg:h-[240px] overflow-hidden rounded-lg"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes gridMoveRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes gridMoveLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
