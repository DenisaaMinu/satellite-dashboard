// The 8 dashboard tabs, in the order of the sidebar (same order as in Figma).
// One list for both the sidebar and the router, so they can never get out of sync.

export type TabId =
    | "overview"
    | "power"
    | "thermal"
    | "attitude"
    | "communications"
    | "payload"
    | "orbit"
    | "pass-history";

export interface Tab {
    id: TabId;
    label: string;
    path: string;
}

export const tabs: Tab[] = [
    { id: "overview", label: "Overview", path: "/overview" },
    { id: "power", label: "Power", path: "/power" },
    { id: "thermal", label: "Thermal", path: "/thermal" },
    { id: "attitude", label: "Attitude control", path: "/attitude" },
    { id: "communications", label: "Communications", path: "/communications" },
    { id: "payload", label: "Payload", path: "/payload" },
    { id: "orbit", label: "Orbit", path: "/orbit" },
    { id: "pass-history", label: "Pass history", path: "/pass-history" },
];

/** The page you land on when you open the dashboard. */
export const homePath = "/overview";
