import { describe, expect, it } from 'vitest';

import { classNames } from './classNames';

describe('classNames', () => {
  it('returns the base class when no modifiers are passed', () => {
    expect(classNames('button')).toBe('button');
  });

  it('adds truthy modifier classes', () => {
    expect(
      classNames('button', {
        active: true,
        disabled: false,
        loading: true,
      }),
    ).toBe('button active loading');
  });

  it('appends additional classes', () => {
    expect(classNames('button', {}, ['extra', undefined, 'wide'])).toBe(
      'button extra wide',
    );
  });
});
