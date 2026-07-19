"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
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
  active,
}: {
  mapKey: ImpactMapKey;
  active?: ImpactPlace;
}) {
  const map = useMap();

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
    // Leaflet has no setter for viscosity post-construction — this is the
    // library's own documented way to change it after the map exists.
    // eslint-disable-next-line react-hooks/immutability
    map.options.maxBoundsViscosity = view.maxBounds ? 0.85 : 0;
    map.setView(view.center, view.zoom, { animate: false });
  }, [map, mapKey]);

  useEffect(() => {
    if (!active) return;
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
      className="ov-impact-leaflet h-[min(62vh,560px)] w-full"
      aria-label={`Impact map — ${mapKey} view with ${places.length} places`}
    >
      <TileLayer
        attribution={IMPACT_TILE_ATTRIBUTION}
        url={IMPACT_TILE_URL}
      />
      <MapViewSync mapKey={mapKey} active={active} />
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
