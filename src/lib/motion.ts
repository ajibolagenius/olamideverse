import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The five named behaviors from docs/VISUAL-IDENTITY.md §6, driven by classes:
 *
 *   .ov-ink-wipe      ink-reveal    — wiping block uncovers a headline
 *   .ov-paste-up      paste-up      — card slaps in with a settle
 *   .ov-marquee-track roll-by       — pure CSS (globals.css), nothing here
 *   .ov-duotone       duotone-shift — accent overlay scrubs out on scroll
 *   .ov-pin-section   pin-scroll    — panel pins while beats scroll past
 *
 * `prefers-reduced-motion: reduce` gets the designed static end state
 * (globals.css) — no tweens, no pins.
 */
export function initMotion(): () => void {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    // ink-reveal
    document.querySelectorAll<HTMLElement>(".ov-ink-wipe").forEach((el) => {
      let block = el.querySelector<HTMLElement>(".ov-ink-wipe-block");
      if (!block) {
        block = document.createElement("span");
        block.className = "ov-ink-wipe-block";
        block.setAttribute("aria-hidden", "true");
        el.appendChild(block);
      }
      gsap.fromTo(
        block,
        { scaleX: 1 },
        {
          scaleX: 0,
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    });

    // paste-up
    document.querySelectorAll<HTMLElement>(".ov-paste-up").forEach((el, i) => {
      const tilt = parseFloat(el.dataset.tilt ?? "0");
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.97, rotation: tilt + 2.2 },
        {
          opacity: 1,
          scale: 1,
          rotation: tilt,
          duration: 0.55,
          ease: "back.out(1.6)",
          delay: (i % 4) * 0.07,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    });

    // duotone-shift
    document.querySelectorAll<HTMLElement>(".ov-duotone").forEach((el) => {
      const overlay = el.querySelector<HTMLElement>(".ov-duotone-overlay");
      if (!overlay) return;
      gsap.fromTo(
        overlay,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "center center",
            scrub: true,
          },
        },
      );
    });

    // pin-scroll
    document.querySelectorAll<HTMLElement>(".ov-pin-section").forEach((el) => {
      const panel = el.querySelector<HTMLElement>(".ov-pin-panel");
      if (!panel) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        pin: panel,
        pinSpacing: false,
      });
    });
  });

  return () => mm.revert();
}
