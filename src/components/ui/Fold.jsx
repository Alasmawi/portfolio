import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// Detail that is a tap away rather than on the page. The sections were each
// two or three screens of prose open by default; a card now shows what it is
// and one line of why, and this holds the rest.
//
// The toggle sits under the panel, so the thing you pressed stays where your
// pointer is while the content opens above the fold line it marks.
export default function Fold({ more = 'Show more', less = 'Show less', color, className = '', children }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelId = useId();

  return (
    <div className={className}>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            className="overflow-hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="-ml-2 mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-accent-body transition-colors hover:text-accent-bright"
        style={color ? { color } : undefined}
      >
        {open ? less : more}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
