// Mock data for the Attitude control tab. Example data, not real satellite values.
// Values follow the Figma Overview. Limits from Appendix 5.
// TODO for the Attitude control tab: roll, pitch, yaw (°), ADCS mode, star tracker status (OK / no lock)
import type { AttitudeTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const attitudeMock: AttitudeTelemetry = {
    bodyRate: {
        label: "Body rate",
        value: 0.4,
        unit: "°/s",
        status: "normal",
        // Up to 1 °/s in pointing modes. Only one limit given, so caution = safe.
        // TODO: the bar end of 1.5 °/s is our choice, confirm with the backend team.
        range: { min: 0, max: 1.5, safe: { min: 0, max: 1 }, caution: { min: 0, max: 1 } },
        ...lastPass,
    },
    pointingError: {
        label: "Pointing error",
        value: 1.2,
        unit: "°",
        status: "normal",
        // Up to 2 ° when imaging, 5 ° for ground station and Sun pointing, critical above 10 °.
        // TODO: the limit depends on the mode. For now: caution above 5, critical above 10. Confirm with the backend team.
        range: { min: 0, max: 12, safe: { min: 0, max: 10 }, caution: { min: 0, max: 5 } },
        ...lastPass,
    },
    reactionWheelSpeed: {
        label: "Reaction wheel speed",
        value: 2150,
        unit: "rpm",
        status: "normal",
        // Max 6000 rpm. Only one limit given, so caution = safe.
        // TODO: the bar end of 7000 rpm is our choice, confirm with the backend team.
        range: { min: 0, max: 7000, safe: { min: 0, max: 6000 }, caution: { min: 0, max: 6000 } },
        ...lastPass,
    },
    // No limits in Appendix 5, so no range bar
    magnetometerX: { label: "Magnetometer X", value: 21.4, unit: "µT", status: "normal", ...lastPass },
    magnetometerY: { label: "Magnetometer Y", value: -8.7, unit: "µT", status: "normal", ...lastPass },
    magnetometerZ: { label: "Magnetometer Z", value: 35.2, unit: "µT", status: "normal", ...lastPass },
};
