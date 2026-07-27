import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import PosterHero from "@/components/PosterHero";
import SavedList from "@/components/SavedList";
import { pageMetadata } from "@/lib/site";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Saved",
    description: "Albums and eras you've saved for offline reading.",
    path: "/saved",
    noindex: true,
  });
}

export default function SavedPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Saved" }]} />
      <PosterHero
        eyebrow="Offline"
        title={
          <>
            Your <span className="text-danfo">reading list</span>
          </>
        }
        intro="Saved pages open even without a connection — a device-local bookmark, no account needed. Live features like comments still need a connection."
      />

      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <SavedList />
      </section>
    </>
  );
}
