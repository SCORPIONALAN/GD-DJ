/**
 * HudDivider — línea decorativa estilo HUD entre secciones.
 * Props: label (string opcional)
 */
export default function HudDivider({ label }) {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 hud-line" />
      {label && (
        <span className="font-mono text-xs uppercase tracking-widest text-cyan/40 whitespace-nowrap">
          {label}
        </span>
      )}
      <div className="flex-1 hud-line" />
    </div>
  );
}
