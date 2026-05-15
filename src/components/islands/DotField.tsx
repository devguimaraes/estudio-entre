import { useEffect, useRef } from "react";

interface DotFieldProps {
  dotColor?: string;
  lineColor?: string;
  bgColor?: string;
  dotSize?: number;
  spacing?: number;
  mouseRadius?: number;
  connectionDistance?: number;
}

export default function DotField({
  dotColor = "rgba(240, 237, 232, 0.6)",
  lineColor = "rgba(240, 237, 232, 0.08)",
  bgColor = "transparent",
  dotSize = 2,
  spacing = 40,
  mouseRadius = 120,
  connectionDistance = 100,
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, width, height);

      if (bgColor !== "transparent") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Store dot positions for connection lines
      const dots: { x: number; y: number; ox: number; oy: number }[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * spacing;
          const oy = r * spacing;

          // Gentle wave motion
          const waveX = Math.sin(time + r * 0.3) * 3;
          const waveY = Math.cos(time + c * 0.3) * 3;

          let x = ox + waveX;
          let y = oy + waveY;

          // Mouse repulsion
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius && dist > 0) {
            const force = (1 - dist / mouseRadius) * 15;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
          }

          dots.push({ x, y, ox, oy });
        }
      }

      // Draw connection lines
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const ddx = dots[i].x - dots[j].x;
          const ddy = dots[i].y - dots[j].y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);

          if (ddist < connectionDistance) {
            const opacity = 1 - ddist / connectionDistance;
            ctx.globalAlpha = opacity * 0.5;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // Draw dots
      ctx.fillStyle = dotColor;
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dotColor, lineColor, bgColor, dotSize, spacing, mouseRadius, connectionDistance]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
}
