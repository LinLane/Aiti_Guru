import { classNames } from '../../libs/classNames';
import styles from './Checkbox.module.css';
import type { CheckboxProps } from './Checkbox.types';

export function Checkbox(props: CheckboxProps) {
  const { label, className, disabled = false, ...restProps } = props;

  const mods = {
    [styles.disabled]: disabled,
    [styles.withLabel]: Boolean(label),
  };

  return (
    <label className={classNames(styles.root, mods, [className])}>
      <input
        type="checkbox"
        disabled={disabled}
        className={styles.input}
        {...restProps}
      />
      <span aria-hidden="true" className={styles.control}>
        <span className={styles.indicator} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}

export default Checkbox;
