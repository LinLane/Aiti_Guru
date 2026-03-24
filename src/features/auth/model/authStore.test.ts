import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../shared/api', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../../../shared/api')>();
  return {
    ...mod,
    apiClient: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

import { apiClient, ApiError } from '../../../shared/api';
import {
  AUTH_SESSION_STORAGE_KEY,
  clearStoredAuthSession,
  saveStoredAuthSession,
} from '../../../shared/config/storage';
import { getAuthErrorMessage, useAuthStore } from './authStore';

const mockedApiClient = vi.mocked(apiClient);

const userFixture = {
  id: 1,
  username: 'emilys',
  email: 'emily@example.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  image: 'https://dummyjson.com/icon/emilys/128',
};

function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    rememberMe: false,
    isAuthenticated: false,
    isInitializing: false,
    isLoading: false,
  });
}

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    clearStoredAuthSession();
    resetAuthStore();
  });

  it('persists remembered login sessions in localStorage', async () => {
    mockedApiClient.post.mockResolvedValue({
      ...userFixture,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await useAuthStore.getState().login({
      username: 'emilys',
      password: 'emilyspass',
      rememberMe: true,
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeTruthy();
    expect(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('persists temporary login sessions in sessionStorage', async () => {
    mockedApiClient.post.mockResolvedValue({
      ...userFixture,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    await useAuthStore.getState().login({
      username: 'emilys',
      password: 'emilyspass',
      rememberMe: false,
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeTruthy();
    expect(window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('restores stored sessions and fetches the current user', async () => {
    saveStoredAuthSession({
      accessToken: 'stored-access-token',
      refreshToken: 'stored-refresh-token',
      rememberMe: true,
      user: null,
    });
    mockedApiClient.get.mockResolvedValue(userFixture);

    await useAuthStore.getState().initialize();

    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().user).toEqual(userFixture);
    expect(useAuthStore.getState().isInitializing).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('maps Invalid credentials to a Russian error message', async () => {
    mockedApiClient.post.mockRejectedValue(
      new ApiError('Invalid credentials', 401, { message: 'Invalid credentials' }),
    );

    let caught: unknown;
    try {
      await useAuthStore.getState().login({
        username: 'wrong',
        password: 'wrong',
        rememberMe: false,
      });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeDefined();
    expect(getAuthErrorMessage(caught)).toBe('Неверный логин или пароль');
  });
});
