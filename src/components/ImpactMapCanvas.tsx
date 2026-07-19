"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  IMPACT_KIND_LABEL,
  type ImpactPlace,
} from "@/lib/content-schema";
import {
  IMPACT_MAP_VIEWS,
  IMPACT_TILE_ATTRIBUTION,
  IMPACT_TILE_URL,
  type ImpactMapKey,
} from "@/lib/impact-map";

import "leaflet/dist/leaflet.css";

const KIND_COLOR: Record<ImpactPlace["kind"], string> = {
  origin: "#F5B301",
  venue: "#1F2A63",
  concert: "#C8451B",
  cultural: "#2F5233",
  international: "#8C4A1E",
};

function markerIcon(kind: ImpactPlace["kind"], selected: boolean) {
  const size = selected ? 22 : 16;
  const color = KIND_COLOR[kind];
  return L.divIcon({
    className: "ov-impact-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<span class="ov-impact-marker-dot${selected ? " is-active" : ""}" style="--pin:${color};width:${size}px;height:${size}px"></span>`,
  });
}

function MapViewSync({
  mapKey,
  places,
  active,
}: {
  mapKey: ImpactMapKey;
  places: ImpactPlace[];
  active?: ImpactPlace;
}) {
  const map = useMap();
  const lastKey = useRef<ImpactMapKey | null>(null);
  const lastActive = useRef<string | null>(null);

  const placeKey = places.map((p) => p.id).join("|");

  // Region / filter change: reset bounds and fit to markers (or default center).
  useEffect(() => {
    const view = IMPACT_MAP_VIEWS[mapKey];
    map.setMinZoom(view.minZoom);
    map.setMaxZoom(view.maxZoom);
    map.setMaxBounds(
      view.maxBounds ?? [
        [-85, -180],
        [85, 180],
      ],
    );
    // Leaflet has no setter for viscosity post-construction.
    // eslint-disable-next-line react-hooks/immutability
    map.options.maxBoundsViscosity = view.maxBounds ? 0.85 : 0;

    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, {
        padding: view.fitPadding,
        maxZoom: Math.min(view.zoom + 1, view.maxZoom),
        animate: false,
      });
    } else {
      map.setView(view.center, view.zoom, { animate: false });
    }
    lastKey.current = mapKey;
    lastActive.current = null;
    // placeKey stands in for places identity (filter changes).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [map, mapKey, placeKey]);

  // Selection change: fly to pin (skip the first paint after a region switch).
  useEffect(() => {
    if (!active) return;
    if (lastKey.current !== mapKey) return;
    if (lastActive.current === active.id) return;
    lastActive.current = active.id;

    const view = IMPACT_MAP_VIEWS[mapKey];
    const targetZoom = Math.min(
      Math.max(map.getZoom(), view.zoom + (mapKey === "world" ? 2 : 1)),
      view.maxZoom,
    );
    map.flyTo([active.lat, active.lng], targetZoom, { duration: 0.55 });
  }, [active, map, mapKey]);

  return null;
}

export default function ImpactMapCanvas({
  mapKey,
  places,
  activeId,
  onSelect,
}: {
  mapKey: ImpactMapKey;
  places: ImpactPlace[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const view = IMPACT_MAP_VIEWS[mapKey];
  const active = places.find((p) => p.id === activeId);

  const icons = useMemo(() => {
    const cache = new Map<string, L.DivIcon>();
    for (const place of places) {
      const selected = place.id === activeId;
      cache.set(
        `${place.id}:${selected ? "1" : "0"}`,
        markerIcon(place.kind, selected),
      );
    }
    return cache;
  }, [places, activeId]);

  return (
    <MapContainer
      key={mapKey}
      center={view.center}
      zoom={view.zoom}
      minZoom={view.minZoom}
      maxZoom={view.maxZoom}
      maxBounds={view.maxBounds}
      maxBoundsViscosity={0.85}
      scrollWheelZoom
      dragging
      touchZoom
      doubleClickZoom
      className="ov-impact-leaflet h-[min(58vh,520px)] w-full sm:h-[min(62vh,560px)]"
      aria-label={`Impact map — ${mapKey} view with ${places.length} places`}
    >
      <TileLayer
        attribution={IMPACT_TILE_ATTRIBUTION}
        url={IMPACT_TILE_URL}
      />
      <MapViewSync mapKey={mapKey} places={places} active={active} />
      {places.map((place) => {
        const selected = place.id === activeId;
        const icon =
          icons.get(`${place.id}:${selected ? "1" : "0"}`) ??
          markerIcon(place.kind, selected);
        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onSelect(place.id),
            }}
            title={`${place.name} — ${IMPACT_KIND_LABEL[place.kind]}`}
          />
        );
      })}
    </MapContainer>
  );
}
