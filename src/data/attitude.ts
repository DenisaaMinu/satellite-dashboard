// Mock data for the Attitude control tab (Denisa). Example data, not real satellite values.
// TODO Denisa: values from Appendix 5:
//   Must: body rate (°/s, up to 1 in pointing modes),
//         pointing error (°, up to 2 imaging / 5 ground station and Sun, critical above 10),
//         reaction wheel speed (rpm, max 6000), magnetometer X, Y, Z (µT)
//   Should: roll, pitch, yaw (°), ADCS mode, star tracker status (OK / no lock)
// See communications.ts for an example of how one value looks.
import type { AttitudeTelemetry } from "../types/tabs";

export const attitudeMock: AttitudeTelemetry = {};
