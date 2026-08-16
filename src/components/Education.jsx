import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GraduationCap, Laptop2 } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import CourseworkModule from './ui/CourseworkModule';
import ProgramJourney from './ui/ProgramJourney';
import { EDUCATION } from '../data/education';

const ICONS = { uob: GraduationCap, reboot: Laptop2 };

export default function Education() {
  const [selectedId, setSelectedId] = useState(EDUCATION[0].id);
  const entry = EDUCATION.find((e) => e.id === selectedId) ?? EDUCATION[0];
  const Icon = ICONS[entry.id] ?? GraduationCap;

  return (
    <section
      id="education"
      className="border-b border-base-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="05"
          id="education"
          title="Education"
          region="~/education"
        />

        <Reveal delay={0.1}>
          {/* Selector row — same shape as the project browser's tab strip,
              not an accordion: switching entries swaps a single detail
              card below rather than each row expanding in place. */}
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Education entries">
            {EDUCATION.map((e) => {
              const active = selectedId === e.id;
              return (
                <button
                  key={e.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedId(e.id)}
                  style={
                    active
                      ? {
                          borderColor: `${e.dotColor}80`,
                          backgroundColor: `${e.dotColor}1A`,
                          color: e.dotColor,
                        }
                      : undefined
                  }
                  className={`rounded border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    active
                      ? ''
                      : 'border-base-border text-text-muted hover:text-text-primary'
                  }`}
                >
                  {e.school}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border border-base-border bg-base-surface/40 p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-base-raised">
                  <Icon size={22} style={{ color: entry.dotColor }} strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: entry.dotColor }}
                  >
                    {entry.school}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-text-dim">
                    {entry.degree} · {entry.period}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                {entry.description}
              </p>

              {entry.coursework && <CourseworkModule />}
              {entry.journey && <ProgramJourney color={entry.dotColor} />}
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
