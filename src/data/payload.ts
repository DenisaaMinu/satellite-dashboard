// Mock data for the Payload tab. Example data, not real satellite values.
// Payload temperature is in thermal.ts (Appendix 5 lists it under Thermal).
import type { PayloadTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const payloadMock: PayloadTelemetry = {
    storageUsed: {
        label: "Storage used",
        value: 34,
        unit: "%",
        status: "normal",
        // Appendix 5 (our proposal): warning at 80 %, critical at 95 %
        range: { min: 0, max: 100, safe: { min: 0, max: 95 }, caution: { min: 0, max: 80 } },
        ...lastPass,
    },
    payloadCurrent: {
        label: "Payload current",
        value: 0.21,
        unit: "A",
        // TODO: safe range still to confirm with the camera team, so this value is not checked yet.
        status: "normal",
        ...lastPass,
    },
    camera: {
        label: "Camera (VIMMI)",
        value: "off",
        status: "off",
        ...lastPass,
    },
    photosTaken: {
        label: "Photos taken",
        value: 12,
        unit: "photos",
        status: "normal",
        ...lastPass,
    },
    oscs: {
        label: "Optical communication (OSCS)",
        value: "idle",
        status: "standby",
        ...lastPass,
    },
};
