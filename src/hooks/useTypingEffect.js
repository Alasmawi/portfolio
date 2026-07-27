import { useEffect, useState } from 'react';

export default function useTypingEffect(
  words,
  { typingSpeed = 65, deletingSpeed = 35, pause = 1600 } = {}
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typingSpeed
        );
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pause);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 0);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          deletingSpeed
        );
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return text;
}
