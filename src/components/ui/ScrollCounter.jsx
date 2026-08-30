// "3 / 14" under a horizontal scroller. Pulled out of HardwareStrip, which had
// the only copy, so the project chip row could show the same thing rather than
// a second implementation of it drifting from the first.
//
// `label` names what is being counted. Two of these can be on screen at once —
// the project row and the hardware gallery inside the selected project — and
// without it they read as one counter contradicting itself.
//
// aria-hidden: this is a visual cue for a sighted reader who cannot see the
// rest of the row. The scroller itself carries the accessible name and role,
// and a screen reader gets position from the list, not from this.
export default function ScrollCounter({ index, total, label, className = '' }) {
  return (
    <p
      className={`font-mono text-[10.5px] tracking-wide text-text-dim ${className}`}
      aria-hidden="true"
    >
      {label ? `${label} ` : ''}
      {index + 1} / {total}
    </p>
  );
}
