// Mock data for the Communications tab. Example data, not real satellite values.
// Values match the Figma design (Communications tab).
import type { CommunicationsTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const communicationsMock: CommunicationsTelemetry = {
    groundStationContact: {
        label: "Ground station contact",
        value: "no-contact", // between passes, so no contact is normal
        status: "standby",
        ...lastPass,
    },
    signalStrength: {
        label: "Signal strength",
        value: 6.0,
        unit: "dB",
        status: "normal",
        // Appendix 5: at least 3 dB above the minimum. No caution zone given, so caution = safe.
        range: { min: 0, max: 10, safe: { min: 3, max: 10 }, caution: { min: 3, max: 10 } },
        ...lastPass,
    },
    downlinkRate: {
        label: "Downlink rate",
        value: 9.6,
        unit: "kbps",
        status: "normal",
        // Appendix 5: VHF/UHF 1.2 to 9.6 kbps
        range: { min: 0, max: 12, safe: { min: 1.2, max: 9.6 }, caution: { min: 1.2, max: 9.6 } },
        ...lastPass,
    },
    framesLastPass: {
        label: "Frames received last pass",
        value: 412,
        unit: "frames",
        status: "normal",
        ...lastPass,
    },
    lastContact: {
        label: "Last contact",
        value: "2026-11-24T12:04:00Z",
        status: "normal",
        ...lastPass,
    },
    sBandRadio: {
        label: "S-band radio",
        value: "standby",
        status: "standby",
        ...lastPass,
    },
};
