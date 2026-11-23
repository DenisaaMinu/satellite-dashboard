// Mock data for the Overview tab. Example data, not real satellite values.
// Only the Overview's own values: the cards and the other tiles reuse the other tabs' data.
import type { OverviewTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const overviewMock: OverviewTelemetry = {
    satelliteMode: {
        label: "Satellite mode",
        value: "nominal",
        // TODO: the list of modes is not final yet (Appendix 5: "other modes to confirm")
        status: "normal",
        ...lastPass,
    },
    deorbitSail: {
        label: "De-orbit sail",
        value: "stowed",
        status: "normal", // stowed is normal during the mission
        ...lastPass,
    },
};
