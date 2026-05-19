import { useEffect, useRef } from 'react';
import { gsap } from './gsap';

interface TextSplitRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  stagger?: number;
}

export default function TextSplitReveal({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  stagger = 0.025,
}: TextSplitRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('.split-char');

    const anim = gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotateX: -60 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.7,
        stagger,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [text, delay, stagger]);

  return (
    <Tag ref={containerRef as any} className={`${className} overflow-hidden`} style={{ perspective: '600px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="split-char inline-block"
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
}
