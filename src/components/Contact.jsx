import { useCallback, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Download, Loader2, Mail, MapPin, Phone, RotateCcw } from 'lucide-react';
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

const TOPICS = ['A role', 'A project', 'Something else'];

const DIRECTORY = [
  { label: 'Phone', value: '+973 3671 1325', href: 'tel:+97336711325', Icon: Phone },
  { label: 'LinkedIn', value: 'linkedin.com/in/alasmawi', href: 'https://linkedin.com/in/alasmawi', Icon: LinkedinMark },
  { label: 'GitHub', value: 'github.com/Alasmawi', href: 'https://github.com/Alasmawi', Icon: GithubMark },
];

function buildMailto({ name, email, topic, message }) {
  const subject = encodeURIComponent(`${topic} — portfolio message${name ? ` from ${name}` : ''}`);
  const body = encodeURIComponent([message, '', email && `Reply to: ${email}`].filter(Boolean).join('\n'));
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

function Row({ label, Icon, children }) {
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3 border-t border-white/[0.07] px-5 py-3.5 first:border-t-0">
      <dt className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
        <Icon size={13} className="shrink-0" />
        {label}
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

export default function Contact() {
  // idle | sending | sent | error | handed-off | stalled
  const [state, setState] = useState('idle');
  const [topic, setTopic] = useState(TOPICS[0]);
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
        topic,
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
            subject: `${draft.topic} — portfolio message from ${draft.name}`,
            from_name: 'alasmawi.dev',
            name: draft.name,
            email: draft.email,
            topic: draft.topic,
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
    [topic, handOffToMailApp]
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
          index="07"
          eyebrow="Contact"
          title="Hiring, or building something? Let’s talk."
          lead="I’m looking to join a product team where I can own features from design to production. Send a line about the role or the problem — I reply to most messages within a day."
        />

        <div className="mt-9 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal delay={0.05} className="h-full">
            <div className="flex h-full flex-col gap-4">
              {/* The address first and largest: it works with no mail app, no
                  form service and no JavaScript. */}
              <div className="glass-pane rounded-[26px] p-5 sm:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">Email</p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="mt-2 block break-all text-[19px] font-medium tracking-[-0.01em] text-text-primary transition-colors hover:text-accent-bright sm:text-[21px]"
                >
                  {EMAIL}
                </a>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`mailto:${EMAIL}`} className="btn btn-ghost glass-control min-h-10 px-4 text-[13px]">
                    <span className="flex items-center gap-2">
                      <Mail size={14} /> Write
                    </span>
                  </a>
                  <button type="button" onClick={copyEmail} className="btn btn-ghost glass-control min-h-10 px-4 text-[13px]">
                    <span className="flex items-center gap-2" aria-live="polite">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy address'}
                    </span>
                  </button>
                </div>
              </div>

              <dl className="glass-pane overflow-hidden rounded-[26px]">
                {DIRECTORY.map(({ label, value, href, Icon }) => (
                  <Row key={label} label={label} Icon={Icon}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      className="group flex min-h-8 items-center gap-1.5 truncate text-[14px] text-text-primary/90 transition-colors hover:text-accent-bright"
                    >
                      <span className="truncate">{value}</span>
                      {href.startsWith('http') && (
                        <ArrowUpRight size={13} className="shrink-0 text-text-dim group-hover:text-accent-bright" />
                      )}
                    </a>
                  </Row>
                ))}
                <Row label="CV" Icon={Download}>
                  <a
                    href={CV_URL}
                    download
                    className="flex min-h-8 items-center gap-1.5 text-[14px] text-text-primary/90 transition-colors hover:text-accent-bright"
                  >
                    Download PDF
                  </a>
                </Row>
                <Row label="Based in" Icon={MapPin}>
                  <p className="flex min-h-8 items-center gap-1.5 text-[14px] text-text-primary/90">
                    Manama, Bahrain <span className="font-mono text-[11.5px] text-text-muted">· UTC+3</span>
                  </p>
                </Row>
              </dl>
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
                  Thanks — it’s in my inbox. I’ll reply to the address you gave, usually within a day.
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
                <fieldset>
                  <legend className="mb-2 font-mono text-xs uppercase tracking-wider text-text-dim">It’s about</legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => {
                      const on = t === topic;
                      return (
                        <label
                          key={t}
                          className={`cursor-pointer rounded-full border px-3.5 py-2 text-[13px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-body ${
                            on
                              ? 'border-accent/70 bg-accent/[0.14] text-text-primary'
                              : 'border-base-edge text-text-primary/75 hover:text-text-primary'
                          }`}
                        >
                          <input
                            type="radio"
                            name="topic"
                            value={t}
                            checked={on}
                            onChange={() => setTopic(t)}
                            className="sr-only"
                          />
                          {t}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

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
                    rows={5}
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
                      instead — the copy button puts it on your clipboard.
                    </>
                  )}
                  {state === 'handed-off' && 'Your mail app has the draft — send it from there.'}
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
