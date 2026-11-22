import { memo, useEffect, useMemo, useRef } from "react";
import { Entity, PointGraphics, PolylineGraphics, Viewer, useCesium } from "resium";
import {
    ArcType,
    buildModuleUrl,
    Cartesian3,
    Color,
    ImageryLayer,
    TileMapServiceImageryProvider,
} from "cesium";
import type { GroundTrackPoint } from "../../types/tabs";
import { formatLatitude, formatLongitude } from "../../utils/format";

import styles from "./Globe3D.module.css";

/** How far away the camera starts, in metres (16 000 km: Europe in the middle, the whole orbit visible) */
const CAMERA_DISTANCE_M = 16_000_000;
const SATELLITE_SIZE_PX = 10;
const ORBIT_LINE_WIDTH_PX = 2;

/**
 * Cesium can't read CSS variables, so we read the token value here and convert it.
 * This way the globe still gets its colours from tokens.css.
 */
function tokenColor(token: string): Color {
    const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    return Color.fromCssColorString(value);
}

/**
 * Puts the camera above the last known position when the globe opens.
 * It must be a child of <Viewer>: Resium only renders children after the Cesium viewer
 * exists, so useCesium() is sure to give us the camera here.
 */
function StartCamera({ lon, lat }: { lon: number; lat: number }) {
    const { camera, scene } = useCesium();
    // Only the first position: when the satellite moves later (live data),
    // the camera stays where the operator put it instead of jumping every second.
    const start = useRef({ lon, lat });

    useEffect(() => {
        if (!camera || !scene) return;
        camera.setView({ destination: Cartesian3.fromDegrees(start.current.lon, start.current.lat, CAMERA_DISTANCE_M) });
        scene.requestRender(); // needed with requestRenderMode, or the old view stays on screen
    }, [camera, scene]);

    return null;
}

interface Globe3DProps {
    /** Last orbit, oldest first. The last point is the last known position. */
    track: GroundTrackPoint[];
    /** km, to draw the orbit at the right height above the Earth */
    altitudeKm: number;
}

// 3D globe with the orbit of the last orbit, using CesiumJS (through Resium, its React wrapper).
// memo(): the Orbit page re-renders every second for the clock; the globe only needs to
// re-render when its data changes.
export const Globe3D = memo(function Globe3D({ track, altitudeKm }: Globe3DProps) {
    const last = track[track.length - 1];

    // Created once. useMemo, or every render would make a new layer and reload the images.
    // NaturalEarthII ships with Cesium: no account, token or internet needed.
    const baseLayer = useMemo(
        () => ImageryLayer.fromProviderAsync(TileMapServiceImageryProvider.fromUrl(buildModuleUrl("Assets/Textures/NaturalEarthII"))),
        [],
    );

    const colors = useMemo(() => ({ line: tokenColor("--chart-line"), outline: tokenColor("--color-bg") }), []);

    // Cesium works in metres, from the centre of the Earth (Cartesian3)
    const orbit = useMemo(
        () => track.map((point) => Cartesian3.fromDegrees(point.lon, point.lat, altitudeKm * 1000)),
        [track, altitudeKm],
    );
    const satellite = orbit[orbit.length - 1];

    const ariaLabel =
        `3D globe with the orbit of the last orbit. Last known position ${formatLatitude(last.lat)}, ${formatLongitude(last.lon)}.`;

    return (
        <figure className={styles.globe} role="img" aria-label={ariaLabel}>
            <Viewer
                className={styles.viewer}
                baseLayer={baseLayer}
                // Hide all of Cesium's own buttons; we only want the globe.
                // geocoder off also means: no search requests to Cesium's servers.
                animation={false}
                timeline={false}
                baseLayerPicker={false}
                geocoder={false}
                homeButton={false}
                sceneModePicker={false}
                navigationHelpButton={false}
                fullscreenButton={false}
                infoBox={false}
                selectionIndicator={false}
                // Only redraw when something changes (mouse drag, new data), saves CPU
                requestRenderMode
            >
                <StartCamera lon={last.lon} lat={last.lat} />
                <Entity name="Orbit, last orbit">
                    <PolylineGraphics
                        positions={orbit}
                        width={ORBIT_LINE_WIDTH_PX}
                        material={colors.line}
                        arcType={ArcType.NONE}
                    />
                </Entity>

                <Entity name="Satellite at last contact" position={satellite}>
                    <PointGraphics
                        pixelSize={SATELLITE_SIZE_PX}
                        color={colors.line}
                        outlineColor={colors.outline}
                        outlineWidth={2}
                    />
                </Entity>
            </Viewer>
        </figure>
    );
});
