import { classNames } from '../../libs/classNames';
import styles from './Link.module.css';
import type { LinkProps } from './Link.types';

export function Link(props: LinkProps) {
  const {
    children,
    underline = true,
    className,
    href = '#',
    ...restProps
  } = props;

  return (
    <a
      href={href}
      className={classNames(
        styles.link,
        { [styles.underline]: underline },
        [className],
      )}
      {...restProps}
    >
      {children}
    </a>
  );
}

export default Link;
