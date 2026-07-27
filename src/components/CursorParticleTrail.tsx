import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  points: number; // 4 or 5 points for star shape
  alpha: number;
  maxLife: number;
  life: number;
  color: string;
  rotation: number;
  rotSpeed: number;
}

interface CursorPoint {
  x: number;
  y: number;
  time: number;
}

export const CursorParticleTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let trailHistory: CursorPoint[] = [];

    let lastX = -100;
    let lastY = -100;

    // Handle canvas sizing
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Metallic golden color palette
    const GOLD_COLORS = [
      '#FFD700', // Bright Metallic Gold
      '#F59E0B', // Amber Gold
      '#FBBF24', // Warm Sunlight Gold
      '#FCD34D', // Soft Diamond Gold
      '#FFFBEB'  // Platinum Gold Core
    ];

    const addParticles = (startX: number, startY: number, endX: number, endY: number) => {
      const dx = endX - startX;
      const dy = endY - startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Determine particle count based on cursor move distance
      const count = Math.min(8, Math.max(2, Math.floor(dist * 0.35) + 1));

      for (let i = 0; i < count; i++) {
        // Smooth linear interpolation along the mouse path
        const t = count === 1 ? 1 : i / (count - 1);
        const px = startX + dx * t;
        const py = startY + dy * t;

        const color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        // Lifespan: ~0.3s - 0.5s at 60fps
        const maxLife = 18 + Math.random() * 12;
        
        // Dispersal velocity
        const angle = Math.random() * Math.PI * 2;
        const dispSpeed = 0.2 + Math.random() * 0.6;

        // ~2.2px to 3.5px star outer radius
        const radius = 2.2 + Math.random() * 1.3;
        const points = Math.random() < 0.6 ? 4 : 5; // 4-point sci-fi diamond stars & 5-point stars

        particles.push({
          x: px + (Math.random() - 0.5) * 3,
          y: py + (Math.random() - 0.5) * 3,
          vx: Math.cos(angle) * dispSpeed,
          vy: Math.sin(angle) * dispSpeed - 0.12, // Gentle golden float
          radius,
          points,
          alpha: 0.95,
          maxLife,
          life: maxLife,
          color,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08
        });
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const prevX = lastX === -100 ? clientX : lastX;
      const prevY = lastY === -100 ? clientY : lastY;

      lastX = clientX;
      lastY = clientY;

      // Add to cursor history trail line
      const now = performance.now();
      trailHistory.push({ x: clientX, y: clientY, time: now });

      // Instantly spawn golden stars along the smooth interpolated path
      addParticles(prevX, prevY, clientX, clientY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Function to render smooth star shapes without expensive shadowBlur lag
    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      points: number,
      outerRadius: number,
      innerRadius: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(cx, cy);
      context.rotate(rotation);

      // Path for star
      context.beginPath();
      const step = Math.PI / points;
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = i * step;
        context.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      context.closePath();

      // Outer ambient light glow (drawn via composite lighter mode, zero shadowBlur cost)
      context.fillStyle = 'rgba(245, 158, 11, 0.35)';
      context.globalAlpha = alpha * 0.45;
      context.fill();

      // Sharp golden star core
      context.fillStyle = color;
      context.globalAlpha = alpha;
      context.fill();

      context.restore();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();

      // Cap max particle array length for performance safety
      if (particles.length > 50) {
        particles = particles.slice(particles.length - 50);
      }

      // 1. Smooth ribbon curve following recent cursor points (younger than 160ms)
      trailHistory = trailHistory.filter((p) => now - p.time < 160);

      if (trailHistory.length > 1) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Smooth quadratic bezier curve connecting history points
        ctx.beginPath();
        ctx.moveTo(trailHistory[0].x, trailHistory[0].y);

        for (let i = 1; i < trailHistory.length - 1; i++) {
          const xc = (trailHistory[i].x + trailHistory[i + 1].x) / 2;
          const yc = (trailHistory[i].y + trailHistory[i + 1].y) / 2;
          ctx.quadraticCurveTo(trailHistory[i].x, trailHistory[i].y, xc, yc);
        }

        ctx.lineTo(
          trailHistory[trailHistory.length - 1].x,
          trailHistory[trailHistory.length - 1].y
        );

        ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.restore();
      }

      // 2. Render & update golden star particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 1;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Smooth position & rotation update
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Smooth velocity dampening
        p.vx *= 0.94;
        p.vy *= 0.94;

        const lifeRatio = p.life / p.maxLife; // 1.0 -> 0.0
        
        // Smooth sine curve fade transition (soft in, soft out)
        const alpha = Math.max(0, Math.sin(Math.pow(lifeRatio, 0.8) * Math.PI) * 0.95);
        const currentRadius = Math.max(0.6, p.radius * Math.pow(lifeRatio, 0.6));
        const innerRadius = currentRadius * (p.points === 4 ? 0.35 : 0.42);

        // Draw smooth star shape
        drawStar(
          ctx,
          p.x,
          p.y,
          p.points,
          currentRadius * 1.8, // outer star tip
          innerRadius,         // inner star notch
          p.rotation,
          p.color,
          alpha
        );
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
};


