export type Mods = Record<string, boolean | undefined | null>;

export function classNames(
  baseClassName: string,
  mods: Mods = {},
  additional: Array<string | undefined> = [],
): string {
  return [
    baseClassName,
    ...additional.filter(Boolean),
    ...Object.entries(mods)
      .filter(([, value]) => Boolean(value))
      .map(([className]) => className),
  ].join(' ');
}
