import type { ReactNode } from "react";
import { DataTable, type Column } from "../DataTable/DataTable";

export interface ValueTableRow {
    label: string;
    now: ReactNode;
    safeRange?: ReactNode;
    lowestHighest?: ReactNode;
    /** Usually a <StatusBadge />. Leave out for values without a safe range. */
    status?: ReactNode;
}

interface ValueTableProps {
    rows: ValueTableRow[];
    /** e.g. "Lowest / highest last 8 passes" */
    lowestHighestHeader: string;
    caption: string;
}

// The value table under the chart on the Communications, Payload and Orbit tabs.
export function ValueTable({ rows, lowestHighestHeader, caption }: ValueTableProps) {
    const columns: Column<ValueTableRow>[] = [
        { header: "Value", cell: (row) => row.label },
        { header: "Now", cell: (row) => row.now, strong: true },
        { header: "Safe range", cell: (row) => row.safeRange },
        { header: lowestHighestHeader, cell: (row) => row.lowestHighest },
        { header: "Status", cell: (row) => row.status },
    ];

    return <DataTable columns={columns} rows={rows} rowKey={(row) => row.label} caption={caption} />;
}
