import { useEffect, useRef } from 'react';
import { gsapPresets } from './gsap';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'parallax' | 'progressive';
  speed?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fadeUp',
  speed = 0.3,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let anim: gsap.core.Tween | undefined;

    switch (animation) {
      case 'fadeUp':
        anim = gsapPresets.fadeUp(ref.current);
        break;
      case 'parallax':
        anim = gsapPresets.parallax(ref.current, speed);
        break;
      default:
        anim = gsapPresets.fadeUp(ref.current);
    }

    return () => {
      anim?.scrollTrigger?.kill();
      anim?.kill();
    };
  }, [animation, speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
