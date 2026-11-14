import type { Status } from '../../types/telemetry';
import styles from './StatusBadge.module.css';
import criticalFilled from '../../assets/icons/critical-filled.svg';
import seriousFilled from '../../assets/icons/serious-filled.svg';
import cautionFilled from '../../assets/icons/caution-filled.svg';
import criticalOutlined from '../../assets/icons/critical-outlined.svg';
import seriousOutlined from '../../assets/icons/serious-outlined.svg';
import cautionOutlined from '../../assets/icons/caution-outlined.svg';
import normalIcon from '../../assets/icons/normal.svg';
import standbyIcon from '../../assets/icons/standby.svg';
import offIcon from '../../assets/icons/off.svg';

// filled: critical, serious, caution only. quiet: normal only.
type Variant = 'filled' | 'outlined' | 'quiet';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  variant?: Variant;
  iconOnly?: boolean;
}

const defaultLabels: Record<Status, string> = {
  critical: 'Critical',
  serious: 'Serious',
  caution: 'Warning',
  normal: 'Normal',
  standby: 'Standby',
  off: 'Off',
};

// Style guide: colour only for problems, grey for everything else.
const defaultVariants: Record<Status, Variant> = {
  critical: 'filled',
  serious: 'filled',
  caution: 'filled',
  normal: 'quiet',
  standby: 'outlined',
  off: 'outlined',
};

function getIcon(status: Status, variant: Variant): string {
  const filled = variant === 'filled';
  switch (status) {
    case 'critical':
      return filled ? criticalFilled : criticalOutlined;
    case 'serious':
      return filled ? seriousFilled : seriousOutlined;
    case 'caution':
      return filled ? cautionFilled : cautionOutlined;
    case 'normal':
      return normalIcon;
    case 'standby':
      return standbyIcon;
    case 'off':
      return offIcon;
  }
}

export function StatusBadge({ status, label, variant, iconOnly = false }: StatusBadgeProps) {
  const text = label ?? defaultLabels[status];
  const style = variant ?? defaultVariants[status];
  const classNames = [styles.badge, styles[style], styles[status], iconOnly ? styles.iconOnly : '']
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classNames}
      role={iconOnly ? 'img' : undefined}
      aria-label={iconOnly ? text : undefined}
    >
      <img className={styles.icon} src={getIcon(status, style)} alt="" />
      {!iconOnly && text}
    </span>
  );
}