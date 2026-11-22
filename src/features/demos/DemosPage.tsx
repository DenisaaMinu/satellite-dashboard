import { useState } from "react";
import { Link } from "react-router";
import {
    simulationStages,
    startSimulation,
    stopSimulation,
    useSimulation,
    type SimMode,
    type SimStage,
} from "../../api/simulation";
import { useNow } from "../../api/useNow";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TabPage } from "../../components/TabPage/TabPage";
import { tabs } from "../../navigation/tabs";
import { formatUtcTime } from "../../utils/format";

import styles from "./DemosPage.module.css";

const modes: { value: SimMode; title: string; description: string }[] = [
    {
        value: "live",
        title: "Live stream",
        description: "New data every second, as if the ground station is always in contact. Best for a demo.",
    },
    {
        value: "passes",
        title: "Realistic passes",
        description:
            "Data only arrives during a pass: the first 8 minutes, then every 95 minutes. In between the values freeze and get older.",
    },
];

/** 83 -> "1 min 23 s" */
function formatElapsed(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes} min ${seconds % 60} s` : `${seconds} s`;
}

// Hidden page (not in the sidebar): start the demo simulator, then watch the tabs.
export function DemosPage() {
    const simulation = useSimulation();
    const now = useNow();
    const [mode, setMode] = useState<SimMode>(simulation.mode);
    const [stage, setStage] = useState<SimStage>(simulation.stage);

    const running = simulation.running;
    const runningStage = simulationStages.find((s) => s.stage === simulation.stage);

    return (
        <TabPage
            title="Demo simulator"
            note="Not part of the operator dashboard: the values are simulated"
            footnote="The simulator runs in real time and keeps running while you switch tabs. Stop it to go back to the fixed mock data."
        >
            <section className={styles.status} aria-live="polite">
                {running ? (
                    <>
                        <StatusBadge status="normal" label="Running" variant="quiet" />
                        <span>
                            Stage {simulation.stage}: {runningStage?.title} ·{" "}
                            {modes.find((m) => m.value === simulation.mode)?.title} · started{" "}
                            {formatUtcTime(new Date(simulation.startedAt))} UTC, {formatElapsed(now.getTime() - simulation.startedAt)} ago
                        </span>
                    </>
                ) : (
                    <>
                        <StatusBadge status="off" label="Stopped" variant="quiet" />
                        <span>The dashboard shows the fixed mock data.</span>
                    </>
                )}
            </section>

            {/* fieldset + legend: screen readers read the question before each option */}
            <fieldset className={styles.group}>
                <legend className={styles.legend}>1. Data mode</legend>
                <div className={styles.options}>
                    {modes.map((option) => (
                        <label key={option.value} className={styles.option}>
                            <input
                                type="radio"
                                name="mode"
                                value={option.value}
                                checked={mode === option.value}
                                onChange={() => setMode(option.value)}
                            />
                            <span className={styles.optionText}>
                                <span className={styles.optionTitle}>{option.title}</span>
                                <span className={styles.optionDescription}>{option.description}</span>
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className={styles.group}>
                <legend className={styles.legend}>2. Stage</legend>
                <div className={styles.stages}>
                    {simulationStages.map((option) => (
                        <label key={option.stage} className={styles.option}>
                            <input
                                type="radio"
                                name="stage"
                                value={option.stage}
                                checked={stage === option.stage}
                                onChange={() => setStage(option.stage)}
                            />
                            <span className={styles.optionText}>
                                <span className={styles.optionTitle}>
                                    {option.stage}. {option.title}
                                </span>
                                <span className={styles.optionDescription}>{option.description}</span>
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className={styles.buttons}>
                <button type="button" className={styles.primary} onClick={() => startSimulation(mode, stage)}>
                    {running ? "Restart with these settings" : "Start"}
                </button>
                <button type="button" className={styles.secondary} onClick={stopSimulation} disabled={!running}>
                    Stop
                </button>
            </div>

            {running && runningStage && (
                <p className={styles.watch}>
                    Watch:{" "}
                    {runningStage.watch.map((id, i) => {
                        const tab = tabs.find((t) => t.id === id);
                        return (
                            tab && (
                                <span key={id}>
                                    {i > 0 && ", "}
                                    <Link to={tab.path} className={styles.link}>
                                        {tab.label}
                                    </Link>
                                </span>
                            )
                        );
                    })}{" "}
                    and the alerts in the top bar.
                </p>
            )}
        </TabPage>
    );
}
