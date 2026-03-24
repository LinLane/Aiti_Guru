import { create } from 'zustand';

import { apiClient, ApiError } from '../../../shared/api';
import {
  clearStoredAuthSession,
  readStoredAuthSession,
  saveStoredAuthSession,
  type StoredAuthUser,
} from '../../../shared/config/storage';

import type {
  AuthSessionSnapshot,
  AuthStore,
  AuthStoreData,
  LoginResponseDto,
  RefreshResponseDto,
} from './authTypes';

export type {
  AuthStore,
  AuthStoreActions,
  AuthStoreData,
  LoginPayload,
} from './authTypes';

const DEFAULT_TOKEN_TTL_MINUTES = 30;

const initialState: AuthStoreData = {
  user: null,
  accessToken: null,
  refreshToken: null,
  rememberMe: false,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
};

function mapLoginApiMessage(message: string): string {
  if (message.trim().toLowerCase() === 'invalid credentials') {
    return 'Неверный логин или пароль';
  }

  return message;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return mapLoginApiMessage(error.message);
  }

  if (error instanceof Error) {
    return mapLoginApiMessage(error.message);
  }

  return 'Не удалось выполнить запрос';
}



export const useAuthStore = create<AuthStore>((set, get) => {
  function clearSession() {
    clearStoredAuthSession();
    set({
      ...initialState,
      isInitializing: false,
    });
  }

  async function refreshSession(): Promise<string | null> {
    const currentRefreshToken = get().refreshToken;

    if (!currentRefreshToken) {
      return null;
    }

    try {
      const response = await apiClient.post<RefreshResponseDto>('/auth/refresh', {
        body: {
          refreshToken: currentRefreshToken,
          expiresInMins: DEFAULT_TOKEN_TTL_MINUTES,
        },
      });

      const sessionSnapshot: AuthSessionSnapshot = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        rememberMe: get().rememberMe,
        user: get().user,
      };

      saveStoredAuthSession(sessionSnapshot);
      set({
        accessToken: sessionSnapshot.accessToken,
        refreshToken: sessionSnapshot.refreshToken,
        isAuthenticated: true,
      });

      return sessionSnapshot.accessToken;
    } catch {
      clearSession();
      return null;
    }
  }

  async function fetchCurrentUser(): Promise<StoredAuthUser | null> {
    const accessToken = get().accessToken;

    if (!accessToken) {
      return null;
    }

    const user = await apiClient.get<StoredAuthUser>('/auth/me', {
      token: accessToken,
      onUnauthorized: () => refreshSession(),
    });

    const currentAccessToken = get().accessToken;
    const currentRefreshToken = get().refreshToken;

    if (currentAccessToken && currentRefreshToken) {
      saveStoredAuthSession({
        accessToken: currentAccessToken,
        refreshToken: currentRefreshToken,
        rememberMe: get().rememberMe,
        user,
      });
    }

    set({
      user,
      isAuthenticated: true,
    });

    return user;
  }

  return {
    ...initialState,

    initialize: async () => {
      const storedSession = readStoredAuthSession();

      if (!storedSession) {
        set({ isInitializing: false });
        return;
      }

      set({
        accessToken: storedSession.accessToken,
        refreshToken: storedSession.refreshToken,
        rememberMe: storedSession.rememberMe,
        user: storedSession.user,
        isAuthenticated: true,
        isInitializing: true,
      });

      try {
        await fetchCurrentUser();
      } catch {
        clearSession();
      } finally {
        set({ isInitializing: false });
      }
    },

    login: async (payload) => {
      set({
        isLoading: true,
      });

      try {
        const response = await apiClient.post<LoginResponseDto>('/auth/login', {
          body: {
            username: payload.username,
            password: payload.password,
            expiresInMins: payload.expiresInMins ?? DEFAULT_TOKEN_TTL_MINUTES,
          },
        });

        const user: StoredAuthUser = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          image: response.image,
        };

        const sessionSnapshot: AuthSessionSnapshot = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          rememberMe: payload.rememberMe,
          user,
        };

        saveStoredAuthSession(sessionSnapshot);

        set({
          user: sessionSnapshot.user,
          accessToken: sessionSnapshot.accessToken,
          refreshToken: sessionSnapshot.refreshToken,
          rememberMe: payload.rememberMe,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        clearStoredAuthSession();
        set({
          ...initialState,
          rememberMe: payload.rememberMe,
          isInitializing: false,
          isLoading: false,
        });

        throw error;
      }
    },
  };
});
