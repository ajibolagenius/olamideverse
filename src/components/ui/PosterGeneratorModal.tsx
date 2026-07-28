"use client";

import { ClipboardText } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import Modal from "@/components/ui/Modal";
import { ACCENTS, type AccentName } from "@/lib/accents";
import { OV_ICON_WEIGHT } from "@/lib/icons";
import { SITE_URL } from "@/lib/site";

/** Poster grounds, drawn from the era accent palette rather than loose hex. */
const PALETTES: { accent: AccentName; label: string }[] = [
  { accent: "danfo", label: "Danfo" },
  { accent: "adire", label: "Adire" },
  { accent: "oxide", label: "Oxide" },
];

/**
 * Paste-up flyer composer for the Street Lingo page — sets a headline in the
 * archive's poster type and copies the wall-text for sharing. Preview only:
 * nothing is rendered to an image, and the credit line marks it as archive
 * ephemera rather than an event announcement.
 */
export default function PosterGeneratorModal({
  open,
  onClose,
  defaultHeadline = "Bariga to the world",
  defaultSubhead = "YBNL Nation · street linguistics",
}: {
  open: boolean;
  onClose: () => void;
  defaultHeadline?: string;
  defaultSubhead?: string;
}) {
  const headlineId = useId();
  const subheadId = useId();
  const [headline, setHeadline] = useState(defaultHeadline);
  const [subhead, setSubhead] = useState(defaultSubhead);
  const [palette, setPalette] = useState<AccentName>("danfo");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const ground = ACCENTS[palette];

  async function handleCopy() {
    const text = [
      headline.toUpperCase(),
      subhead.toUpperCase(),
      `Archived on OlamideVerse — ${SITE_URL}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the
      // preview text stays on screen to copy by hand.
      setCopied(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Poster generator">
      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-ink-soft">
            Poster ground
          </legend>
          <div className="flex gap-2">
            {PALETTES.map((option) => {
              const swatch = ACCENTS[option.accent];
              const selected = palette === option.accent;
              return (
                <button
                  key={option.accent}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPalette(option.accent)}
                  className={`flex-1 border-2 py-2 text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-transform ${
                    selected ? "border-ink shadow-paste-sm" : "border-ink/40 opacity-70"
                  }`}
                  style={{ background: swatch.solid, color: swatch.onSolid }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor={headlineId}
              className="mb-1 block text-[0.72rem] font-bold tracking-[0.08em] uppercase text-ink-soft"
            >
              Headline
            </label>
            <input
              id={headlineId}
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={48}
              className="font-display w-full border-2 border-ink bg-white p-2.5 text-lg uppercase text-ink"
            />
          </div>
          <div>
            <label
              htmlFor={subheadId}
              className="mb-1 block text-[0.72rem] font-bold tracking-[0.08em] uppercase text-ink-soft"
            >
              Subhead
            </label>
            <input
              id={subheadId}
              type="text"
              value={subhead}
              onChange={(e) => setSubhead(e.target.value)}
              maxLength={64}
              className="w-full border-2 border-ink bg-white p-2 text-xs font-bold uppercase text-ink"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-ink-soft">
            Preview
          </p>
          <div
            className="ov-tape relative border-4 border-ink p-8 text-center shadow-paste"
            style={{ background: ground.solid, color: ground.onSolid }}
          >
            <span className="ov-stamp border-current text-[0.65rem]">
              Lagos paste-up archive
            </span>
            <h3 className="font-display mt-4 mb-2 text-display-md leading-none uppercase">
              {headline || "Your headline"}
            </h3>
            <p className="mt-4 inline-block border-t-2 border-current pt-2 text-xs font-bold tracking-[0.12em] uppercase">
              {subhead || "Subhead"}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t-2 border-ink/15 pt-4">
          <button
            type="button"
            onClick={handleCopy}
            className="ov-btn ov-btn-danfo ov-icon-inline px-4 py-2 text-xs"
          >
            <ClipboardText
              className="ov-icon"
              size={16}
              weight={OV_ICON_WEIGHT}
              aria-hidden
            />
            {copied ? "Copied" : "Copy poster text"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
