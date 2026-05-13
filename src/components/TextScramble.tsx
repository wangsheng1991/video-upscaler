import { useState, useEffect, useRef, useCallback } from 'react';

interface TextScrambleProps {
  text: string;
  className?: string;
  trigger?: 'hover' | 'mount' | 'inView';
  duration?: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function TextScramble({
  text,
  className = '',
  trigger = 'inView',
  duration = 1200,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [hasPlayed, setHasPlayed] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const scramble = useCallback(() => {
    if (hasPlayed && trigger !== 'hover') return;

    setHasPlayed(true);
    const length = text.length;
    const intervalTime = 50;
    const totalIterations = duration / intervalTime;

    intervalRef.current.forEach(clearInterval);
    intervalRef.current = [];

    for (let i = 0; i < length; i++) {
      let iteration = 0;
      const interval = setInterval(() => {
        setDisplayText((prev) => {
          const current = prev.split('');
          if (iteration >= totalIterations * ((i + 1) / length)) {
            current[i] = text[i];
            clearInterval(interval);
            return current.join('');
          }
          current[i] = chars[Math.floor(Math.random() * chars.length)];
          return current.join('');
        });
        iteration++;
      }, intervalTime);
      intervalRef.current.push(interval);
    }
  }, [text, duration, hasPlayed, trigger]);

  useEffect(() => {
    if (trigger === 'mount') {
      scramble();
    }
    return () => {
      intervalRef.current.forEach(clearInterval);
    };
  }, [trigger, scramble]);

  useEffect(() => {
    if (trigger !== 'inView') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            scramble();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasPlayed, scramble, trigger]);

  return (
    <span
      ref={ref}
      className={`font-mono text-cyan cursor-default ${className}`}
      onMouseEnter={trigger === 'hover' ? scramble : undefined}
    >
      {displayText}
    </span>
  );
}
