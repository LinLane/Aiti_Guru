import { classNames } from '../../libs/classNames';
import styles from './Delimiter.module.css';
import type { DelimiterProps } from './Delimiter.types';

export function Delimiter(props: DelimiterProps) {
  const { text, className, ...restProps } = props;

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={classNames(
        styles.root,
        { [styles.withText]: Boolean(text) },
        [className],
      )}
      {...restProps}
    >
      <span aria-hidden="true" className={styles.line} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}

export default Delimiter;
