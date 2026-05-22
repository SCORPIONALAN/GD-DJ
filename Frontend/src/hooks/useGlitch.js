import { useState, useEffect } from 'react';

/**
 * Activa un efecto glitch en texto cada cierto intervalo aleatorio.
 * Uso: const glitching = useGlitch()
 * Aplica la clase 'glitch' al elemento cuando glitching === true.
 */
export function useGlitch(minMs = 8000, maxMs = 14000) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    let timeout;

    const schedule = () => {
      const delay = minMs + Math.random() * (maxMs - minMs);
      timeout = setTimeout(() => {
        setGlitching(true);
        setTimeout(() => { setGlitching(false); schedule(); }, 600);
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, [minMs, maxMs]);

  return glitching;
}
