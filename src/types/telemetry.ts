export type Status = 'critical' | 'serious' | 'caution' | 'normal' | 'standby' | 'off';

export type ProblemStatus = Extract<Status, 'caution' | 'serious' | 'critical'>;

export type Limits = { min: number; max: number };
