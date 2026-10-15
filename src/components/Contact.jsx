import { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Loader2, Mail, MapPin, Phone, RotateCcw } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import Reveal from './ui/Reveal';
import { FRAME, SECTION_PAD, SECTION_Y } from './ui/SectionHeader';
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
  const [formOpen, setFormOpen] = useState(false);
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
    // The last section, on the carmine ground: the address set as large as it
    // will go, because writing to it is the one thing this section is for.
    <section id="contact" className={`on-red relative bg-carmine text-bone ${SECTION_PAD}`}>
      <div className={`${FRAME} ${SECTION_Y}`}>
        <Reveal>
          <h2 className="display text-[clamp(52px,10.5vw,148px)]">Contact</h2>
          <a
            href={`mailto:${EMAIL}`}
            className="display-sm mt-6 block break-all text-[clamp(24px,5.2vw,76px)] underline decoration-bone/40 decoration-2 underline-offset-[0.14em] transition-colors hover:decoration-bone"
          >
            {EMAIL}
          </a>
          <button type="button" onClick={copyEmail} className="label mt-3 inline-flex min-h-11 items-center gap-2 hover:underline">
            <span className="flex items-center gap-2" aria-live="polite">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy address'}
            </span>
          </button>
        </Reveal>

        <div className="mt-8 grid gap-x-16 gap-y-8 border-t border-bone/30 pt-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <Reveal delay={0.05}>
            <p className="max-w-[40ch] text-[16px] leading-relaxed text-bone/90">
              For roles or project inquiries, email me or use the form. I usually reply within a day.
            </p>
            <ul className="mt-5 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
              {DIRECTORY.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    aria-label={`${label}: ${value}`}
                    className="flex min-h-11 items-center gap-3 text-[15.5px] hover:underline"
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{value}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={CV_URL} download className="flex min-h-11 items-center gap-3 text-[15.5px] hover:underline">
                  <Download size={16} className="shrink-0" />
                  Download CV
                </a>
              </li>
              <li className="flex min-h-11 items-center gap-3 text-[15.5px] text-bone/85">
                <MapPin size={16} className="shrink-0" aria-hidden="true" />
                Manama, Bahrain (UTC+3)
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            {/* On a phone the form opens on request: the address and the links
                above already cover the job. */}
            {!formOpen && (
              <button type="button" onClick={() => setFormOpen(true)} className="btn btn-ghost glass-control w-full lg:hidden">
                <Mail size={15} aria-hidden="true" />
                Send a message
              </button>
            )}
            <div className={formOpen ? '' : 'hidden lg:block'}>
              {state === 'sent' ? (
                <div ref={statusRef} role="status">
                  <h3 className="display-sm text-[40px]">Message sent.</h3>
                  <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-bone/90">
                    Thanks. I’ll reply to the address you gave, usually within a day.
                  </p>
                  <button type="button" onClick={() => setState('idle')} className="btn btn-ghost glass-control mt-6">
                    <RotateCcw size={14} /> Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
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
                      placeholder="A few sentences about the role or the project."
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

                  <button type="submit" disabled={sending} className="btn btn-primary btn-block disabled:opacity-70">
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
                    className="min-h-[1.25rem] text-[14px] leading-snug text-bone/90"
                  >
                    {state === 'error' && (
                      <>
                        That didn’t go through. Write to{' '}
                        <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
                          {EMAIL}
                        </a>{' '}
                        directly and it will reach me.
                      </>
                    )}
                    {state === 'stalled' && (
                      <>
                        Nothing opened, so this device has no mail app set up. Write to{' '}
                        <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
                          {EMAIL}
                        </a>{' '}
                        instead. The copy button puts it on your clipboard.
                      </>
                    )}
                    {state === 'handed-off' && 'Your mail app has the draft. Send it from there.'}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        {/* A real landmark, so "jump to footer" works in a screen reader. */}
        <footer className="label mt-12 flex flex-col gap-3 border-t border-bone/30 pt-6 text-bone/85 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Abdulla Alasmawi</p>
          <a href="/v1/" className="inline-flex min-h-6 items-center gap-1.5 py-1.5 hover:underline">
            Previous version of this site
            <ArrowUpRight size={12} />
          </a>
        </footer>
      </div>
    </section>
  );
}
