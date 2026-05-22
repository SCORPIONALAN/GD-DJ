/**
 * Faqs — acordeón de preguntas frecuentes.
 */
import { useEffect, useState } from 'react';
import { publicAPI } from '../lib/api';
import { useReveal } from '../hooks/useReveal';

export default function Faqs() {
  const [faqs, setFaqs]     = useState([]);
  const [open, setOpen]     = useState(null);
  const [ref, visible] = useReveal();

  useEffect(() => {
    publicAPI.getFaqs().then((r) => setFaqs(r.data)).catch(() => null);
  }, []);

  if (!faqs.length) return null;

  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  return (
    <section className="py-24 px-4 max-w-3xl mx-auto" ref={ref}>
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <p className="section-label">FAQ</p>
        <h2 className="section-title mb-10">Preguntas frecuentes</h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-bg-1 border border-cyan/10 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(faq._id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-bg-2 transition-colors"
                aria-expanded={open === faq._id}
              >
                <span className="font-body font-medium text-ink pr-4">{faq.question}</span>
                <span
                  className={`text-cyan text-lg transition-transform duration-200 flex-shrink-0 ${
                    open === faq._id ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>

              {open === faq._id && (
                <div className="px-6 pb-5 text-ink-dim text-sm leading-relaxed border-t border-cyan/10 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
