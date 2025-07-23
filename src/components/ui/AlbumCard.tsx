'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Atropos from 'atropos/react';
import 'atropos/css';
import type { Album } from '@/types/models';

interface AlbumCardProps {
    album: Album;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
    return (
        <Link href={`/albums/${album.id}`} className="block">
            <Atropos
                className="w-full h-full"
                highlight={true}
                shadow={false}
                rotateTouch={false}
            >
                <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="relative aspect-square">
                        <Image
                            src={album.coverArtUrl}
                            alt={`${album.title} album cover`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            data-atropos-offset="0"
                            priority={false}
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                            data-atropos-offset="3"
                        >
                            <span className="text-xs text-white/80">{new Date(album.releaseDate).getFullYear()}</span>
                            <h3 className="text-lg font-bold text-white">{album.title}</h3>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {album.metadata.genre?.slice(0, 2).map((genre, index) => (
                                    <span key={index} className="text-xs bg-primary-500/80 text-white px-2 py-0.5 rounded-full">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Atropos>
        </Link>
    );
};

export default AlbumCard;
