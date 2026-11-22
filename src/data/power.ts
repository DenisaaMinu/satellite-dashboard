// Mock data for the Power tab (Denisa). Example data, not real satellite values.
// TODO Denisa: values from Appendix 5:
//   Must: battery 1 voltage (V, 12.0-16.0, cut-off 10.3), battery 2 voltage (V, same),
//         state of charge (%, warning below 40, critical below 25),
//         solar array current (A, max 3 per input), battery heater (on/off)
//   Should: charging or draining, total power use (W, normally 11.7-17.5)
//   Could: cell voltages (V, 3.0-4.0 per cell)
// See communications.ts for an example of how one value looks.
import type { PowerTelemetry } from "../types/tabs";

export const powerMock: PowerTelemetry = {};
