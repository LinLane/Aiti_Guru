import { beforeEach, describe, expect, it } from 'vitest';

import {
  AUTH_SESSION_STORAGE_KEY,
  clearStoredAuthSession,
  readStoredAuthSession,
  saveStoredAuthSession,
  type StoredAuthSession,
} from './authStorage';

const sessionFixture: StoredAuthSession = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  rememberMe: true,
  user: {
    id: 1,
    username: 'emilys',
    email: 'emily@example.com',
    firstName: 'Emily',
    lastName: 'Johnson',
    image: 'https://dummyjson.com/icon/emilys/128',
  },
};

describe('authStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('stores remembered sessions in localStorage', () => {
    saveStoredAuthSession(sessionFixture);

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeTruthy();
    expect(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('stores temporary sessions in sessionStorage', () => {
    saveStoredAuthSession({
      ...sessionFixture,
      rememberMe: false,
    });

    expect(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeTruthy();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('reads the stored session back', () => {
    saveStoredAuthSession(sessionFixture);

    expect(readStoredAuthSession()).toEqual(sessionFixture);
  });

  it('clears both storages on logout', () => {
    saveStoredAuthSession(sessionFixture);
    clearStoredAuthSession();

    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
    expect(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });
});
