import type { GroundTrackPoint } from "../../types/tabs";
import { formatLatitude, formatLongitude } from "../../utils/format";

import styles from "./GroundTrackMap.module.css";

const LATITUDES = [60, 30, 0, -30, -60];
const LONGITUDES = [-180, -120, -60, 0, 60, 120, 180];

/** 60 -> "60° N", 0 -> "0°" */
function latLabel(lat: number) {
    return lat === 0 ? "0°" : `${Math.abs(lat)}° ${lat > 0 ? "N" : "S"}`;
}

/** -120 -> "120° W", 180 -> "180°" */
function lonLabel(lon: number) {
    return lon === 0 || Math.abs(lon) === 180 ? `${Math.abs(lon)}°` : `${Math.abs(lon)}° ${lon > 0 ? "E" : "W"}`;
}

/**
 * Cut the track where it crosses the 180° line, or the line would jump across the whole map.
 * Returns one list of points per piece.
 */
function splitAtDateLine(track: GroundTrackPoint[]): GroundTrackPoint[][] {
    const pieces: GroundTrackPoint[][] = [[]];
    track.forEach((point, i) => {
        const previous = track[i - 1];
        if (previous && Math.abs(point.lon - previous.lon) > 180) pieces.push([]);
        pieces[pieces.length - 1].push(point);
    });
    return pieces;
}

// Flat world map (longitude left-right, latitude up-down) with the ground track on top.
// TODO: map type still to confirm (see Figma). No land outlines yet.
export function GroundTrackMap({ track }: { track: GroundTrackPoint[] }) {
    const last = track[track.length - 1];
    const ariaLabel =
        `Ground track of the last orbit. Last known position ${formatLatitude(last.lat)}, ${formatLongitude(last.lon)}.`;

    return (
        <figure className={styles.map} role="img" aria-label={ariaLabel}>
            <div className={styles.yAxis}>
                {LATITUDES.map((lat) => (
                    <span key={lat} className={styles.yLabel} style={{ bottom: `${((lat + 90) / 180) * 100}%` }}>
                        {latLabel(lat)}
                    </span>
                ))}
            </div>

            <div className={styles.plot}>
                {/* viewBox in degrees: x = longitude, y = -latitude (SVG y goes down) */}
                <svg className={styles.svg} viewBox="-180 -90 360 180" preserveAspectRatio="none" aria-hidden="true">
                    {LATITUDES.map((lat) => (
                        <line key={`lat${lat}`} className={styles.grid} x1={-180} x2={180} y1={-lat} y2={-lat} />
                    ))}
                    {LONGITUDES.map((lon) => (
                        <line key={`lon${lon}`} className={styles.grid} x1={lon} x2={lon} y1={-90} y2={90} />
                    ))}
                    {splitAtDateLine(track).map((piece, i) => (
                        <polyline
                            key={i}
                            className={styles.track}
                            points={piece.map((point) => `${point.lon},${-point.lat}`).join(" ")}
                        />
                    ))}
                </svg>

                {/* HTML instead of SVG, so the dot stays round when the map stretches */}
                <div
                    className={styles.satellite}
                    style={{ left: `${((last.lon + 180) / 360) * 100}%`, bottom: `${((last.lat + 90) / 180) * 100}%` }}
                />
            </div>

            <div className={styles.xAxis}>
                {LONGITUDES.map((lon) => (
                    <span key={lon} className={styles.xLabel} style={{ left: `${((lon + 180) / 360) * 100}%` }}>
                        {lonLabel(lon)}
                    </span>
                ))}
            </div>
        </figure>
    );
}
