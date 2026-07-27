import Link from "next/link";
import AlbumCard from "@/components/AlbumCard";
import SectionLabel from "@/components/ui/SectionLabel";
import type { CollaboratorMatch } from "@/lib/collaborators";
import type { Album, Era } from "@/lib/content-schema";

export default function RelatedAlbums({
  sameEra,
  era,
  collaboratorMatches,
  showFavorites,
}: {
  sameEra: Album[];
  era: Era;
  collaboratorMatches: CollaboratorMatch[];
  showFavorites: boolean;
}) {
  if (sameEra.length === 0 && collaboratorMatches.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
      {sameEra.length > 0 ? (
        <div className={collaboratorMatches.length > 0 ? "mb-10" : undefined}>
          <SectionLabel>More from {era.title}</SectionLabel>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {sameEra.map((album) => (
              <AlbumCard key={album.slug} album={album} era={era} showFavorite={showFavorites} />
            ))}
          </div>
        </div>
      ) : null}

      {collaboratorMatches.length > 0 ? (
        <div>
          <SectionLabel>Also featuring</SectionLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            {collaboratorMatches.map((match) => (
              <div key={match.name} className="border-3 border-ink bg-white p-4 shadow-paste-sm">
                <p className="mb-2 text-sm font-bold tracking-[0.04em] uppercase">{match.name}</p>
                <ul className="space-y-1.5">
                  {match.albums.map((album) => (
                    <li key={album.slug} className="text-sm">
                      <Link
                        href={`/albums/${album.slug}`}
                        className="ov-link-underline font-semibold hover:text-oxide"
                      >
                        {album.title}
                      </Link>
                      <span className="ml-1.5 text-xs text-ink-soft">· {album.year}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
