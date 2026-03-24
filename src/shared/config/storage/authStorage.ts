export interface StoredAuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface StoredAuthSession {
  accessToken: string;
  refreshToken: string;
  rememberMe: boolean;
  user: StoredAuthUser | null;
}

export const AUTH_SESSION_STORAGE_KEY = 'auth-session';

function getWindowStorage(type: 'local' | 'session'): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return type === 'local' ? window.localStorage : window.sessionStorage;
}

function readStorage(type: 'local' | 'session'): StoredAuthSession | null {
  const storage = getWindowStorage(type);

  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredAuthSession;
  } catch {
    storage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

export function readStoredAuthSession(): StoredAuthSession | null {
  return readStorage('local') ?? readStorage('session');
}

export function saveStoredAuthSession(session: StoredAuthSession): void {
  clearStoredAuthSession();

  const targetStorage = getWindowStorage(session.rememberMe ? 'local' : 'session');

  targetStorage?.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAuthSession(): void {
  getWindowStorage('local')?.removeItem(AUTH_SESSION_STORAGE_KEY);
  getWindowStorage('session')?.removeItem(AUTH_SESSION_STORAGE_KEY);
}
