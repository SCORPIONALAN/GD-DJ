import { useEffect, useRef, useState } from 'react';

/**
 * Anima elementos cuando entran al viewport.
 * Uso: const [ref, visible] = useReveal()
 * Aplica clases condicionalmente según `visible`.
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
