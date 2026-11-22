import type { ReactNode } from "react";

import styles from "./DataTable.module.css";

export interface Column<Row> {
    header: string;
    /** What to show in this column for one row */
    cell: (row: Row) => ReactNode;
    /** Bold text, for the "Now" and "Time" columns */
    strong?: boolean;
}

interface DataTableProps<Row> {
    columns: Column<Row>[];
    rows: Row[];
    /** A unique key per row, for React */
    rowKey: (row: Row) => string | number;
    /** Hidden title for screen readers, e.g. "Communications values" */
    caption: string;
}

// A plain table. <Row> is a generic: the table works with any kind of row,
// and TypeScript checks that every column's cell() gets the right row type.
export function DataTable<Row>({ columns, rows, rowKey, caption }: DataTableProps<Row>) {
    return (
        <table className={styles.table}>
            <caption className={styles.caption}>{caption}</caption>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column.header} scope="col" className={styles.th}>
                            {column.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={rowKey(row)}>
                        {columns.map((column) => (
                            <td
                                key={column.header}
                                className={column.strong ? `${styles.td} ${styles.strong}` : styles.td}
                            >
                                {column.cell(row)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
