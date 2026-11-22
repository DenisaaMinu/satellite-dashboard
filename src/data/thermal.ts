// Mock data for the Thermal tab (Denisa). Example data, not real satellite values.
// TODO Denisa: values from Appendix 5:
//   Must: battery 1 and 2 temperature (°C, -20 to 70), flight computer temperature (°C, -30 to 60),
//         payload temperature (°C, safe range to confirm with the VIMMI camera team),
//         solar panel temperatures, 6 sides (°C, -40 to 125)
//   Could: reaction wheel temperature (°C, -15 to 50)
// See communications.ts for an example of how one value looks.
import type { ThermalTelemetry } from "../types/tabs";

export const thermalMock: ThermalTelemetry = {};
