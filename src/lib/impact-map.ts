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
    }
> = {
    lagos: {
        center: [6.52, 3.37],
        zoom: 11,
        minZoom: 10,
        maxZoom: 15,
        maxBounds: [
            [6.35, 3.15],
            [6.75, 3.55],
        ],
    },
    nigeria: {
        center: [9.05, 7.5],
        zoom: 6,
        minZoom: 5,
        maxZoom: 12,
        maxBounds: [
            [3.8, 2.2],
            [14.2, 15.0],
        ],
    },
    world: {
        center: [12, 8],
        zoom: 2,
        minZoom: 1,
        maxZoom: 8,
    },
};

/** Carto Positron — light basemap that reads closer to paper than default OSM. */
export const IMPACT_TILE_URL =
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

export const IMPACT_TILE_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> · &copy; <a href="https://carto.com/attributions" rel="noopener noreferrer">CARTO</a>';
