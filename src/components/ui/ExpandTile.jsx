import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// The site-wide "click for detail" pattern: a summary row that's always
// visible, and a body that expands in place rather than navigating away or
// opening a modal — reading like expanding a row in a dashboard table
// rather than a generic FAQ accordion. Intended to be reused wherever a
// list needs a compact default with detail on demand: focus areas here,
// and later education entries, experience entries, etc.
export default function ExpandTile({
  trigger,
  children,
  defaultOpen = false,
  className = '',
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div
      className={`border border-base-border bg-base-surface/60 transition-colors ${
        open ? 'border-accent/50' : ''
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        {trigger}
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={`shrink-0 text-text-dim transition-transform duration-300 ${
            open ? 'rotate-180 text-accent-bright' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
