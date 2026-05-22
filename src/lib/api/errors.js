export class ApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    if (cause !== undefined) this.cause = cause;
  }
}

export class NetworkError extends ApiError {
  constructor(message, options = {}) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends NetworkError {
  constructor(message, options = {}) {
    super(message, options);
    this.name = 'TimeoutError';
  }
}
