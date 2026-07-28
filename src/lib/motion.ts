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
 *
 * Timings live here (not as CSS custom properties) because GSAP tweens take
 * plain numbers/eases, not `var(...)`. The CSS-side hover/press transitions
 * (buttons, links, lift) have their own token set in globals.css/tokens.css
 * (--ov-duration-*, --ov-ease-snap) — the two sets are named independently
 * on purpose, one per runtime.
 */
const DURATION = {
  inkReveal: 0.9,
  pasteUpIn: 0.55,
};

const EASE = {
  inkReveal: "power3.inOut",
  pasteUpIn: "back.out(1.6)",
};

const PASTE_UP_STAGGER = 0.07;

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
          duration: DURATION.inkReveal,
          ease: EASE.inkReveal,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        },
      );
    });

    // paste-up
    let pasteUpIndex = 0;
    const pasteUp = (el: HTMLElement) => {
      if (el.dataset.ovMotion) return; // already has a tween
      el.dataset.ovMotion = "paste-up";
      const tilt = parseFloat(el.dataset.tilt ?? "0");
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.97, rotation: tilt + 2.2 },
        {
          opacity: 1,
          scale: 1,
          rotation: tilt,
          duration: DURATION.pasteUpIn,
          ease: EASE.pasteUpIn,
          delay: (pasteUpIndex++ % 4) * PASTE_UP_STAGGER,
          // Deliberately NOT clearing opacity: the `.js .ov-paste-up` rule in
          // globals.css sets opacity 0, so dropping the inline opacity GSAP
          // wrote hands the card straight back to that rule and it vanishes
          // the instant it finishes animating in.
          clearProps: "scale",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    };
    document.querySelectorAll<HTMLElement>(".ov-paste-up").forEach(pasteUp);

    // duotone-shift
    document.querySelectorAll<HTMLElement>(".ov-duotone").forEach((el) => {
      const overlay = el.querySelector<HTMLElement>(".ov-duotone-overlay");
      if (!overlay) return;
      gsap.fromTo(
        overlay,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            end: "center 45%",
            scrub: 0.5,
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

    /**
     * Filterable grids re-render their cards, and modals mount on demand —
     * those nodes arrive after the pass above, so nothing would ever animate
     * them and the `.js .ov-paste-up` rule would keep them at opacity 0
     * permanently. Catch them as they land.
     */
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.classList.contains("ov-paste-up")) pasteUp(node);
          node.querySelectorAll<HTMLElement>(".ov-paste-up").forEach(pasteUp);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Trigger positions are measured before cover art and the subset fonts
    // land; without a recalc, a card whose start point moved offscreen never
    // fires and stays hidden.
    const remeasure = () => ScrollTrigger.refresh();
    window.addEventListener("load", remeasure);
    document.fonts?.ready.then(remeasure).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener("load", remeasure);
    };
  });

  return () => {
    mm.revert();
    // revert() strips the inline opacity GSAP wrote, handing every card back
    // to the CSS rule that hides it. Drop the markers so the next pass treats
    // anything that survived the navigation as fresh and reveals it again.
    document
      .querySelectorAll<HTMLElement>("[data-ov-motion]")
      .forEach((el) => delete el.dataset.ovMotion);
  };
}
