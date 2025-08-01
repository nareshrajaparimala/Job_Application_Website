import { useEffect, useRef } from 'react';

/**
 * Custom hook to add scroll animation classes to elements when they enter the viewport.
 * @param {string} animationClass - The CSS animation class to add (e.g. 'move-in-left').
 * @returns {React.RefObject} - Ref to be attached to the element to animate.
 */
export function useScrollAnimation(animationClass) {
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add(animationClass);
          node.classList.remove('scroll-animate');
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.1,
      }
    );

    node.classList.add('scroll-animate');
    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [animationClass]);

  return elementRef;
}
