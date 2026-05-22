/**
 * Toast — notificaciones emergentes en esquina inferior derecha.
 * Props: toasts (array), onRemove (fn)
 */
export default function Toast({ toasts = [], onRemove }) {
  const COLORS = {
    success: 'border-neon-green/50 text-neon-green',
    error:   'border-magenta/50 text-magenta',
    info:    'border-cyan/50 text-cyan',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 bg-bg-2 border rounded-lg px-4 py-3 shadow-cyan animate-fade-in ${COLORS[t.type] ?? COLORS.info}`}
        >
          <span className="flex-1 text-sm font-body text-ink">{t.message}</span>
          <button
            type="button"
            onClick={() => onRemove(t.id)}
            className="text-ink-mute hover:text-ink transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
