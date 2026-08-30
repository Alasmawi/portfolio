import { useCallback, useRef, useState } from 'react';
import { Check, Copy, Mail, Phone } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import Reveal from './ui/Reveal';

const EMAIL = 'asmawiabdulla0@gmail.com';

// The email is not in this row. It now sits beside the form, at full size with
// a copy button; repeating it in the footer said the same thing twice within
// one screen.
const LINKS = [
  { label: '+973 3671 1325', href: 'tel:+97336711325', Icon: Phone },
  { label: 'github.com/Alasmawi', href: 'https://github.com/Alasmawi', Icon: GithubMark },
  { label: 'linkedin.com/in/alasmawi', href: 'https://linkedin.com/in/alasmawi', Icon: LinkedinMark },
];

// No backend exists for this static site — Send composes a mailto: draft with
// the form's contents instead of pretending to submit somewhere.
//
// On a phone with no mail client configured, setting location.href to a mailto:
// does nothing at all: no error, no navigation, no feedback. You type a message,
// press Send, and the page sits there. So the address is offered directly
// alongside, and a failed handoff says so rather than staying silent.
const EMAIL_FALLBACK_MS = 900;

function buildMailto({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio contact${name ? ` from ${name}` : ''}`);
  const body = encodeURIComponent(
    [message, '', email && `Reply to: ${email}`].filter(Boolean).join('\n')
  );
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export default function Contact() {
  // 'idle' | 'handed-off' | 'stalled' — stalled means the mail client never
  // took it, which is the case that used to be invisible.
  const [state, setState] = useState('idle');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const statusRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const draft = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    // If a mail client takes the handoff the tab loses visibility or focus.
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
      // It appears below the Send button, which on a phone can put it under
      // the tab bar — and it is the one thing the reader now needs to see.
      requestAnimationFrame(() =>
        statusRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      );
    }, EMAIL_FALLBACK_MS);

    window.location.href = buildMailto(draft);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked. The address is right there as selectable text.
      setCopied(false);
    }
  }, []);

  return (
    <section id="contact" className="bg-base-bg px-5 pb-9 pt-11 sm:px-10 sm:pt-14 md:px-14 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          <Reveal>
            <p className="mb-5 font-mono text-[11.5px] uppercase tracking-[0.18em] text-text-muted">
              // [ contact ]
            </p>
            <h2 className="max-w-[20ch] text-3xl font-medium leading-[1.1] tracking-tight text-text-primary md:text-[38px]">
              Tell me what you are trying to measure.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[14.5px] leading-relaxed text-text-primary/66">
              I reply to most things within a day. If it involves sensors, a gateway, or AWS, send
              the constraint you are stuck on rather than the job title.
            </p>

            {/* The address, in the open, next to the form rather than only in
                the footer below it. Send needs a mail client; this needs
                nothing. */}
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-base-edge px-3 font-mono text-[13px] text-text-primary transition-colors hover:border-accent/60 hover:text-accent-bright"
              >
                <Mail size={14} className="shrink-0" />
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-base-edge px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted transition-colors hover:border-accent/60 hover:text-accent-bright"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="grid gap-3.5 md:min-w-[340px]">
              <div className="field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" className="input" placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="you@company.com"
                />
              </div>
              <div className="field">
                <label htmlFor="contact-message">What you are building</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="input"
                  placeholder="A sentence is enough."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send
              </button>
              {/* aria-live so a screen reader hears this too — it appears
                  without anything moving focus. */}
              <p
                ref={statusRef}
                role="status"
                aria-live="polite"
                className="min-h-[1.25rem] text-[13px] leading-snug text-text-muted"
              >
                {state === 'stalled' ? (
                  <>
                    Nothing opened, so this device has no mail app set up. Write to{' '}
                    <a href={`mailto:${EMAIL}`} className="text-accent-bright underline underline-offset-2">
                      {EMAIL}
                    </a>{' '}
                    instead — the copy button above puts it on your clipboard.
                  </>
                ) : null}
              </p>
            </form>
          </Reveal>
        </div>

        <div className="hr-fade my-8 md:my-10" />

        {/* A real landmark, so "jump to footer" works in a screen reader. */}
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11.5px] text-text-dim">alasmawi.dev · Manama, Bahrain · UTC+3</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                // py-1.5 clears the 24px WCAG 2.2 target minimum; these sit in
                // a flex row, so they don't get the inline-text exemption.
                className="inline-flex min-h-6 items-center gap-2 py-1.5 font-mono text-[11.5px] text-text-muted transition-colors hover:text-accent-bright"
              >
                <Icon size={13} className="shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
