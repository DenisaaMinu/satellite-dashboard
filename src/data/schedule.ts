// Mock data: the next pass over the ground station. Example data, not real satellite values.
// Matches "Next pass: in 42 min · 12:54 UTC" in the top bar.
import type { PassSchedule } from "../types/tabs";
import { demoTime } from "./time";

export const scheduleMock: PassSchedule = {
    groundStation: "Delft",
    nextPassStart: demoTime("2026-11-24T12:54:00Z"),
};
