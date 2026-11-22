// Mock data for the Overview tab (Denisa). Example data, not real satellite values.
// The six health cards can reuse the other tabs' data through the api functions.
// TODO Denisa: the "Status" card group from Appendix 5 goes here:
//   Must: satellite mode, overall health, camera-to-Sun warning (°), de-orbit sail deployed,
//         last data received
//   Should: next pass over the ground station, sunlight or shadow
import type { OverviewTelemetry } from "../types/tabs";

export const overviewMock: OverviewTelemetry = {};
