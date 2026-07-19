import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import type { ImpactPlace } from "@/lib/content-schema";

export type ImpactMapKey = ImpactPlace["map"];

export const IMPACT_MAP_VIEWS: Record<
  ImpactMapKey,
  {
    center: LatLngExpression;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    maxBounds?: LatLngBoundsExpression;
    /** Padding when fitting to visible markers */
    fitPadding: [number, number];
  }
> = {
  lagos: {
    center: [6.52, 3.37],
    zoom: 11,
    minZoom: 10,
    maxZoom: 15,
    // Wide enough for Agege (north) and Island (south) without feeling lost.
    maxBounds: [
      [6.38, 3.2],
      [6.7, 3.5],
    ],
    fitPadding: [36, 36],
  },
  nigeria: {
    center: [8.2, 7.2],
    zoom: 6,
    minZoom: 5,
    maxZoom: 11,
    maxBounds: [
      [3.9, 2.5],
      [14.0, 14.8],
    ],
    fitPadding: [40, 40],
  },
  world: {
    center: [18, 5],
    zoom: 2,
    minZoom: 1,
    maxZoom: 7,
    fitPadding: [48, 48],
  },
};

/** Carto Positron — light basemap that reads closer to paper than default OSM. */
export const IMPACT_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export const IMPACT_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> · &copy; <a href="https://carto.com/attributions" rel="noopener noreferrer">CARTO</a>';
