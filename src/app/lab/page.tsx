import Link from "next/link";
import { ArrowRight, Sparkle } from "@phosphor-icons/react/ssr";
import { OV_ICON_WEIGHT } from "@/lib/icons";

interface LabPrototypeItem {
  id: string;
  number: string;
  title: string;
  description: string;
  route: string;
  tags: string[];
  status: string;
}

const PROTOTYPES: LabPrototypeItem[] = [
  {
    id: "spine",
    number: "PROTOTYPE 01",
    title: "Career Spine & Editorial Materiality",
    description:
      "A unified six-era interactive timeline rail (2010 Upstart → 2026+ Legacy) connecting eras, albums, and moments. Includes documentary folio stamps, SVG halftone photography, and cassette J-card sleeves.",
    route: "/lab/spine",
    tags: ["Wayfinding Spine", "Editorial Folios", "Halftone Duotone", "Cassette J-Card"],
    status: "Active Exploration",
  },
  {
    id: "transit",
    number: "PROTOTYPE 02",
    title: "Lagos Danfo Transit Map",
    description:
      "Reimagining the /impact geographic archive as a Lagos Danfo & BRT subway-style vector transit network. Features 45° route schematics, station departure boards, and stamped conductor punch cards.",
    route: "/lab/transit",
    tags: ["Transit Cartography", "Danfo Line", "Ticket Stubs", "Station Board"],
    status: "Active Exploration",
  },
  {
    id: "player",
    number: "PROTOTYPE 03",
    title: "Tactile Cassette Boombox Player",
    description:
      "Physical music packaging for the persistent player dock. Dual rotating cassette spools, analog VU level meters, mechanical transport controls, and a 7-inch vinyl turntable toggle.",
    route: "/lab/player",
    tags: ["Cassette Boombox", "Rotating Spools", "Analog VU Meter", "45 RPM Vinyl"],
    status: "Active Exploration",
  },
  {
    id: "lineage",
    number: "PROTOTYPE 04",
    title: "YBNL Lineage Blueprint",
    description:
      "Architectural archival blueprint family tree reimagining /influence. Maps the dynasty from Coded Tunes to YBNL Nation to the modern Empire era with interactive detective dossier sheets.",
    route: "/lab/lineage",
    tags: ["Dynastic Blueprint", "Dossier Files", "Alumni Tracking", "Family Tree"],
    status: "Active Exploration",
  },
  {
    id: "signwriting",
    number: "PROTOTYPE 05",
    title: "Lagos Signwriting & Editorial Red-Penning",
    description:
      "Exploring authentic hand-painted Lagos street signboards (Danfo slogans, trade signboards) alongside editor manuscript proof-reading callouts, red-pen circled years, and archival rubber stamps.",
    route: "/lab/signwriting",
    tags: ["Lagos Signwriting", "Red-Pen Proof", "Margin Notes", "Rubber Stamps"],
    status: "Active Exploration",
  },
  {
    id: "p3-sensory",
    number: "PROTOTYPE 06",
    title: "Display P3 Gamut & Sensory Engine",
    description:
      "Wide-gamut Display P3 color calibration giving Danfo Yellow vibrant street radiance on OLED screens, paired with an opt-in synthetic Web Audio analog cassette tape-click engine.",
    route: "/lab/p3-sensory",
    tags: ["Display P3 Gamut", "CSS Color-4", "Analog Clicks", "Web Audio"],
    status: "Active Exploration",
  },
];

export default function LabIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Lab Header */}
      <div className="border-b-2 border-ink pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-soft">
          <Sparkle weight={OV_ICON_WEIGHT} className="h-4 w-4 text-danfo" />
          <span>Presentational Prototyping Space</span>
        </div>
        <h1 className="mt-2 font-display text-display-lg uppercase leading-none">
          Archive Design Lab
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-ink-soft leading-relaxed">
          Six isolated design explorations testing next-generation editorial techniques,
          cartographic transit networks, tactile music packaging, and street materiality for
          OlamideVerse without altering live production routes.
        </p>
      </div>

      {/* Prototype Showcase Grid (6 Prototypes) */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROTOTYPES.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col justify-between border-2 border-ink bg-white p-6 shadow-print transition-all hover:-translate-y-1 hover:shadow-paste"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="border border-ink bg-danfo px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink">
                  {p.number}
                </span>
                <span className="text-[0.68rem] font-mono font-bold uppercase text-ink-muted">
                  {p.status}
                </span>
              </div>

              <h2 className="mt-4 font-display text-xl uppercase tracking-tight text-ink">
                {p.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                {p.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-ink/20 bg-paper px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-ink-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
              <span className="font-mono text-[0.68rem] text-ink-muted">{p.route}</span>
              <Link
                href={p.route}
                className="inline-flex items-center gap-1 border border-ink bg-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-danfo hover:text-ink"
              >
                <span>Launch</span>
                <ArrowRight weight={OV_ICON_WEIGHT} className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
