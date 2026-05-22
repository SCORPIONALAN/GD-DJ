import { useState, useMemo } from 'react';

/**
 * Lógica del calculador de precios del DJ.
 * El recargo aumenta según el número de personas.
 */
const SURCHARGES = [
  { max: 50,  pct: 0    },
  { max: 100, pct: 0.10 },
  { max: 200, pct: 0.20 },
  { max: 300, pct: 0.30 },
  { max: Infinity, pct: 0.45 },
];

function getSurcharge(guests) {
  return SURCHARGES.find((s) => guests <= s.max)?.pct ?? 0;
}

export function useCalculator(services = []) {
  const [selectedService, setSelectedService] = useState(null);
  const [hours, setHours]   = useState(4);
  const [guests, setGuests] = useState(50);

  const service = useMemo(
    () => services.find((s) => s._id === selectedService) ?? services[0] ?? null,
    [services, selectedService]
  );

  const total = useMemo(() => {
    if (!service) return 0;
    const base      = service.price * Math.max(1, hours - (service.duration / 60 - 1));
    const surcharge = getSurcharge(guests);
    return Math.round(base * (1 + surcharge));
  }, [service, hours, guests]);

  return {
    service, selectedService, setSelectedService,
    hours, setHours,
    guests, setGuests,
    total,
  };
}
