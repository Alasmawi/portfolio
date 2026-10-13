import { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Loader2, MapPin, Phone, RotateCcw } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import { CV_URL } from '../data/navLinks';

const EMAIL = 'asmawiabdulla0@gmail.com';

// Messages go through Web3Forms, which emails them to the address the access
// key was created with. The key is public by design — it can only send to that
// one inbox — so it lives in a VITE_ env var rather than a secret. Set
// VITE_WEB3FORMS_KEY in Vercel (Settings → Environment Variables) and redeploy.
//
// Without a key the form still works: Send hands a drafted email to the
// visitor's mail app, and says so plainly if nothing picks it up.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const EMAIL_FALLBACK_MS = 900;

const DIRECTORY = [
  { label: 'Phone', value: '+973 3671 1325', href: 'tel:+97336711325', Icon: Phone },
  { label: 'LinkedIn', value: 'linkedin.com/in/alasmawi', href: 'https://linkedin.com/in/alasmawi', Icon: LinkedinMark },
  { label: 'GitHub', value: 'github.com/Alasmawi', href: 'https://github.com/Alasmawi', Icon: GithubMark },
];

function buildMailto({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio message${name ? ` from ${name}` : ''}`);
  const body = encodeURIComponent([message, '', email && `Reply to: ${email}`].filter(Boolean).join('\n'));
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export default function Contact() {
  // idle | sending | sent | error | handed-off | stalled
  const [state, setState] = useState('idle');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const statusRef = useRef(null);

  const handOffToMailApp = useCallback((draft) => {
    // If a mail client takes the handoff, the tab loses focus or visibility.
    // Neither happening within the window means nothing picked it up.
    const settled = () => {
      clearTimeout(timerRef.current);
      setState('handed-off');
      window.removeEventListener('blur', settled);
      document.removeEventListener('visibilitychange', settled);
    };
    window.addEventListener('blur', settled, { once: true });
    document.addEventListener('visibilitychange', settled, { once: true });
    timerRef.current = setTimeout(() => {
      window.removeEventListener('blur', settled);
      document.removeEventListener('visibilitychange', settled);
      setState('stalled');
      requestAnimationFrame(() => statusRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    }, EMAIL_FALLBACK_MS);
    window.location.href = buildMailto(draft);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      // The honeypot: invisible to people, filled in by bots.
      if (form.botcheck?.checked) return;
      const draft = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim(),
      };

      if (!WEB3FORMS_KEY) {
        handOffToMailApp(draft);
        return;
      }

      setState('sending');
      try {
        const res = await fetch(WEB3FORMS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Portfolio message from ${draft.name}`,
            from_name: 'alasmawi.dev',
            name: draft.name,
            email: draft.email,
            message: draft.message,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || `HTTP ${res.status}`);
        form.reset();
        setState('sent');
      } catch {
        setState('error');
      }
      requestAnimationFrame(() => statusRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    },
    [handOffToMailApp]
  );

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked. The address is right there as selectable text.
    }
  }, []);

  const sending = state === 'sending';

  return (
    <section id="contact" className={`relative pb-9 pt-12 sm:pt-16 md:pb-12 md:pt-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          index="06"
          eyebrow="Contact"
          title="Hiring, or building something? Let’s talk."
          lead="Send a line about the role or the problem. I reply to most messages within a day."
        />

        <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal delay={0.05}>
            {/* Set on the page, not in panes. This column was two boxed panels
                — an email card and a five-row labelled table — beside the
                boxed form, and three panels of ruled rows was the heaviest
                screen on the site for the simplest job on it. The address
                leads because it works with no mail app, no form service and
                no JavaScript; the rest is a short list of links. */}
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">Email</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-2 block break-all text-[19px] font-medium tracking-[-0.01em] text-text-primary transition-colors hover:text-accent-bright sm:text-[21px]"
              >
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="-ml-2 mt-1 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-[13px] text-text-primary/75 transition-colors hover:text-text-primary"
              >
                <span className="flex items-center gap-2" aria-live="polite">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy address'}
                </span>
              </button>

              <ul className="mt-5 grid gap-1 border-t border-white/[0.08] pt-4">
                {DIRECTORY.map(({ label, value, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      aria-label={`${label}: ${value}`}
                      className="group flex min-h-11 items-center gap-3 text-[14.5px] text-text-primary/85 transition-colors hover:text-accent-bright"
                    >
                      <Icon size={16} className="shrink-0 text-text-muted transition-colors group-hover:text-accent-bright" />
                      <span className="truncate">{value}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={CV_URL}
                    download
                    className="group flex min-h-11 items-center gap-3 text-[14.5px] text-text-primary/85 transition-colors hover:text-accent-bright"
                  >
                    <Download size={16} className="shrink-0 text-text-muted transition-colors group-hover:text-accent-bright" />
                    Download CV
                  </a>
                </li>
              </ul>

              <p className="mt-4 flex items-center gap-3 text-[13.5px] text-text-muted">
                <MapPin size={16} className="shrink-0" aria-hidden="true" />
                Manama, Bahrain · UTC+3
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="h-full">
            {state === 'sent' ? (
              <div
                ref={statusRef}
                role="status"
                className="glass-pane flex h-full min-h-[420px] flex-col items-start justify-center rounded-[26px] p-6 sm:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal/15 text-signal">
                  <Check size={20} />
                </span>
                <h3 className="mt-5 text-[24px] font-medium tracking-tight text-text-primary">Message sent.</h3>
                <p className="mt-2 max-w-[40ch] text-[15px] leading-relaxed text-text-primary/75">
                  Thanks, it’s in my inbox. I’ll reply to the address you gave, usually within a day.
                </p>
                <button
                  type="button"
                  onClick={() => setState('idle')}
                  className="btn btn-ghost glass-control mt-6 min-h-10 px-4 text-[13px]"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw size={14} /> Send another
                  </span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-pane grid h-full gap-4 rounded-[26px] p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="contact-name">Name</label>
                    <input id="contact-name" name="name" required autoComplete="name" className="input" placeholder="Your name" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="input"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    className="input"
                    placeholder="The role, the team, or the problem. A few sentences is plenty."
                  />
                </div>
                {/* Honeypot. Off-screen rather than display:none, which some
                    bots skip. */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />

                <button type="submit" disabled={sending} className="btn btn-primary btn-block min-h-12 text-[15px] disabled:opacity-70">
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Sending…
                    </span>
                  ) : (
                    'Send message'
                  )}
                </button>

                <p
                  ref={statusRef}
                  role="status"
                  aria-live="polite"
                  className="min-h-[1.25rem] text-[13px] leading-snug text-text-muted"
                >
                  {state === 'error' && (
                    <>
                      That didn’t go through. Write to{' '}
                      <a href={`mailto:${EMAIL}`} className="text-accent-bright underline underline-offset-2">
                        {EMAIL}
                      </a>{' '}
                      directly and it will reach me.
                    </>
                  )}
                  {state === 'stalled' && (
                    <>
                      Nothing opened, so this device has no mail app set up. Write to{' '}
                      <a href={`mailto:${EMAIL}`} className="text-accent-bright underline underline-offset-2">
                        {EMAIL}
                      </a>{' '}
                      instead. The copy button puts it on your clipboard.
                    </>
                  )}
                  {state === 'handed-off' && 'Your mail app has the draft. Send it from there.'}
                </p>
              </form>
            )}
          </Reveal>
        </div>

        <div className="hr-fade my-10" />

        {/* A real landmark, so "jump to footer" works in a screen reader. */}
        <footer className="flex flex-col gap-3 font-mono text-[11.5px] text-text-dim sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Abdulla Alasmawi · Built with React, Tailwind CSS and Framer Motion</p>
          <a
            href="/v1/"
            className="inline-flex min-h-6 items-center gap-1.5 py-1.5 text-text-muted transition-colors hover:text-accent-bright"
          >
            Previous version of this site
            <ArrowUpRight size={12} />
          </a>
        </footer>
      </div>
    </section>
  );
}
