import type { ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import { AppShell } from "./components/AppShell/AppShell";
import { tabs, homePath, type TabId } from "./navigation/tabs";
import { OverviewPage } from "./features/overview/OverviewPage";
import { PowerPage } from "./features/power/PowerPage";
import { ThermalPage } from "./features/thermal/ThermalPage";
import { AttitudeControlPage } from "./features/attitude/AttitudeControlPage";
import { CommunicationsPage } from "./features/communications/CommunicationsPage";
import { PayloadPage } from "./features/payload/PayloadPage";
import { OrbitPage } from "./features/orbit/OrbitPage";
import { PassHistoryPage } from "./features/pass-history/PassHistoryPage";

// Which page each tab shows. Record<TabId, ...> means TypeScript gives an error
// if a tab in tabs.ts has no page here.
const pages: Record<TabId, ReactNode> = {
    overview: <OverviewPage />,
    power: <PowerPage />,
    thermal: <ThermalPage />,
    attitude: <AttitudeControlPage />,
    communications: <CommunicationsPage />,
    payload: <PayloadPage />,
    orbit: <OrbitPage />,
    "pass-history": <PassHistoryPage />,
};

export const router = createBrowserRouter([
    {
        // AppShell (top bar + sidebar) stays on screen; the tab page renders inside its <Outlet />
        path: "/",
        element: <AppShell />,
        children: [
            // "/" opens the Overview
            { index: true, element: <Navigate to={homePath} replace /> },
            ...tabs.map((tab) => ({ path: tab.path, element: pages[tab.id] })),
            // Unknown URL: go back to the Overview instead of showing an empty page
            { path: "*", element: <Navigate to={homePath} replace /> },
        ],
    },
]);
