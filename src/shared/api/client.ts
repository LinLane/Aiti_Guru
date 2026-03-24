import { ApiError, type RequestOptions } from './types';

const API_BASE_URL = 'https://dummyjson.com';

function createHeaders(options: RequestOptions): Headers {
  const headers = new Headers(options.headers);
  const body = options.body;

  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  return headers;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    body: JSON.stringify(options.body),
    headers: createHeaders(options),
  });

  if (
    response.status === 401 &&
    options.retryOnUnauthorized !== false &&
    options.onUnauthorized
  ) {
    const nextToken = await options.onUnauthorized();

    if (nextToken) {
      return request<T>(path, {
        ...options,
        token: nextToken,
        onUnauthorized: undefined,
        retryOnUnauthorized: false,
      });
    }
  }

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data
        ? String(data.message)
        : response.statusText || 'Request failed';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get<T>(path: string, options: RequestOptions = {}) {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, options: RequestOptions = {}) {
    return request<T>(path, { ...options, method: 'POST' });
  },
};
