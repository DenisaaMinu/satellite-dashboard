// Shared mock times, so all tabs tell the same story:
// the last pass ended at 12:04 UTC on the demo day, the next pass is at 12:54 UTC.
// Example data, not real satellite values.

/** The moment of the demo story: 8 min after the last pass ended. */
const DEMO_STORY_NOW = new Date("2026-11-24T12:12:30Z").getTime();

/** How far the story moves, so that DEMO_STORY_NOW becomes the moment the dashboard was opened */
const shift = Date.now() - DEMO_STORY_NOW;

/**
 * Turns a time from the demo story into a time relative to now.
 * demoTime("2026-11-24T12:04:00Z") = 8.5 minutes before the dashboard was opened.
 * So "8 min ago" is true when you open the page, and it counts up live from there,
 * like real data would.
 */
export function demoTime(storyTime: string): string {
    return new Date(new Date(storyTime).getTime() + shift).toISOString();
}

/** Measured on board at the end of the last pass, received at 12:04 UTC */
export const lastPass = {
    measuredAt: demoTime("2026-11-24T12:03:40Z"),
    receivedAt: demoTime("2026-11-24T12:04:00Z"),
};
