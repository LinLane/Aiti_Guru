export interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse | string | null;

  constructor(
    message: string,
    status: number,
    data: ApiErrorResponse | string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions
  extends Omit<RequestInit, 'body' | 'headers'> {
  body?: BodyInit | Record<string, unknown> | null;
  headers?: HeadersInit;
  token?: string | null;
  onUnauthorized?: () => Promise<string | null>;
  retryOnUnauthorized?: boolean;
}

