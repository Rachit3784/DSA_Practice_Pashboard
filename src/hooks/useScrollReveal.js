import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = { threshold: 0.1, triggerOnce: true }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.triggerOnce && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else if (!options.triggerOnce) {
          setIsVisible(false);
        }
      });
    }, options);

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options.threshold, options.triggerOnce]);

  return [domRef, isVisible];
}
