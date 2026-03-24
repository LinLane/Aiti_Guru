import type { StoredAuthUser } from '../../../shared/config/storage';

export interface LoginResponseDto extends StoredAuthUser {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSessionSnapshot {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
  user: StoredAuthUser | null;
}

export interface AuthStoreData {
  user: StoredAuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  username: string;
  password: string;
  rememberMe: boolean;
  expiresInMins?: number;
}

export interface AuthStoreActions {
  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
}

export type AuthStore = AuthStoreData & AuthStoreActions;
