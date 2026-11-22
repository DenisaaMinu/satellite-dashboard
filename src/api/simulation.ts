// Controls for the demo simulator (/demos page).
// Components use these instead of importing from data/ directly (see CLAUDE.md).
import { useSyncExternalStore } from "react";
import {
    getSimState,
    simulationStages,
    startSimulation,
    stopSimulation,
    subscribe,
    type SimMode,
    type SimStage,
    type SimStageInfo,
    type SimState,
} from "../data/simulator";

export { simulationStages, startSimulation, stopSimulation };
export type { SimMode, SimStage, SimStageInfo, SimState };

/**
 * The simulator's state (running, mode, stage), updated live.
 * useSyncExternalStore: React's way to read a value that lives outside React.
 */
export function useSimulation(): SimState {
    return useSyncExternalStore(subscribe, getSimState);
}
