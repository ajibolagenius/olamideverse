/**
 * Deterministic decorative waveform heights for audiogram cards.
 * Not real audio analysis — visual texture only (embeds remain the player).
 */
export function waveformBars(seed: number, count = 48): number[] {
  let s = seed >>> 0 || 1;
  return Array.from({ length: count }, (_, i) => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    const noise = 0.22 + ((s % 1000) / 1000) * 0.78;
    const envelope = Math.sin((i / (count - 1)) * Math.PI);
    const pulse = 0.85 + 0.15 * Math.sin(i * 0.55 + (seed % 7));
    return Math.max(0.1, Math.min(1, noise * (0.35 + 0.65 * envelope) * pulse));
  });
}
