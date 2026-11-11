/**
 * Standard Laravel API response shapes & validation errors
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiPaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

export interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}
