import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Reusable GSAP animation presets
export const gsapPresets = {
  fadeUp: (element: string | Element, trigger?: string | Element) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  },

  parallax: (element: string | Element, speed: number = 0.3) => {
    return gsap.to(element, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  },

  splitTextReveal: (element: string | Element) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el || !el.textContent) return;

    const text = el.textContent;
    el.innerHTML = '';
    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(40px)';
      el.appendChild(span);
      return span;
    });

    return gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });
  },

  horizontalScroll: (container: string | Element, sections: string | Element) => {
    const cont = typeof container === 'string' ? document.querySelector(container) : container;
    if (!cont) return;
    const sects = cont.querySelectorAll(typeof sections === 'string' ? sections : ':scope > *');

    return gsap.to(sects, {
      xPercent: -100 * (sects.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        snap: 1 / (sects.length - 1),
        end: () => `+=${(cont as HTMLElement).offsetWidth}`,
      },
    });
  },

  progressiveReveal: (elements: string, trigger?: string | Element) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || elements,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  },
};
