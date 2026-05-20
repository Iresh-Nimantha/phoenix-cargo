import { useEffect, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';

interface Particle {
  x: number;
  y: number;
  r: number; // size
  d: number; // speed weight
  color: string;
  swaySpeed: number;
  swayAmplitude: number;
  angle: number;
  type?: 'snowflake' | 'leaf';
}

export default function SeasonalEffect() {
  const { activeSeasonalEffect } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeSeasonalEffect === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle settings
    const maxParticles = activeSeasonalEffect === 'autumn' ? 35 : 85;
    const particles: Particle[] = [];

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const isSnow = activeSeasonalEffect === 'christmas' || activeSeasonalEffect === 'winter';
      const size = isSnow ? Math.random() * 3.5 + 1.2 : Math.random() * 8 + 6;
      
      let color = 'rgba(255, 255, 255, 0.85)';
      if (!isSnow) {
        // Autumn leaf colors (crimson, orange, gold)
        const colors = [
          'rgba(217, 119, 6, 0.7)',   // amber/gold
          'rgba(180, 83, 9, 0.7)',    // brown/orange
          'rgba(220, 38, 38, 0.65)',  // crimson
          'rgba(245, 158, 11, 0.7)',   // yellow
        ];
        color = colors[Math.floor(Math.random() * colors.length)];
      }

      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -20,
        r: size,
        d: Math.random() * 0.9 + 0.3, // speed weight
        color,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayAmplitude: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        type: isSnow ? 'snowflake' : 'leaf',
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.fillStyle = p.color;

        if (p.type === 'snowflake') {
          // Circular snowflake
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
          ctx.fill();
        } else {
          // Leaf shape
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r / 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    const update = () => {
      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        p.angle += p.swaySpeed;
        
        // Sway left and right
        p.x += Math.sin(p.angle) * 0.4;
        // Move downwards
        p.y += p.d * (p.type === 'snowflake' ? 1.1 : 0.7) + p.r * 0.03;

        // Leaf rotation
        if (p.type === 'leaf') {
          p.angle += 0.008;
        }

        // Reset particle if it goes out of screen bounds
        if (p.y > height + 20 || p.x > width + 20 || p.x < -20) {
          particles[i] = createParticle(false);
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeSeasonalEffect]);

  if (activeSeasonalEffect === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
