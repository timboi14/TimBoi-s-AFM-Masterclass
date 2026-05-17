import { useEffect, useState } from 'react';

/**
 * Floating red "Stop voice playback" button — visible only while
 * window.speechSynthesis.speaking is true. Polls every 250ms.
 * Respects prefers-reduced-motion (no transition fade).
 *
 * Work Item 9 of the Platinum-tier upgrade.
 */
export function StopVoice() {
  const [voiceActive, setVoiceActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const tick = () => setVoiceActive(window.speechSynthesis.speaking);
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  if (!voiceActive) return null;

  return (
    <button
      type="button"
      onClick={() => window.speechSynthesis?.cancel()}
      aria-label="Stop voice playback"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-danger text-white font-bold text-[13px] uppercase tracking-wider shadow-[0_8px_24px_-6px_rgba(220,38,38,0.55)] motion-safe:transition-opacity motion-safe:animate-in motion-safe:fade-in hover:brightness-110"
    >
      <i className="fa-solid fa-stop" aria-hidden="true" />
      Stop voice playback
    </button>
  );
}
