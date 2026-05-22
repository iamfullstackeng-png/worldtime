import { ApiError, NetworkError, TimeoutError } from './errors.js';

const DEFAULT_TIMEOUT_MS = 10_000;

const isPlainObject = (v) =>
  v !== null &&
  typeof v === 'object' &&
  !Array.isArray(v) &&
  typeof v !== 'string' &&
  !(typeof Blob !== 'undefined' && v instanceof Blob) &&
  !(typeof FormData !== 'undefined' && v instanceof FormData) &&
  !(typeof ArrayBuffer !== 'undefined' && v instanceof ArrayBuffer) &&
  !(typeof URLSearchParams !== 'undefined' && v instanceof URLSearchParams);

async function readBodySafely(response) {
  try {
    const text = await response.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

/**
 * Transport-only fetch wrapper. The only place in the app that calls `fetch`.
 * Higher concerns (retry, dedup, caching) belong in Redux thunks or page layers.
 *
 * @param {string} url
 * @param {{
 *   method?: string,
 *   headers?: Record<string, string>,
 *   body?: unknown,
 *   timeoutMs?: number,
 *   signal?: AbortSignal,
 * }} [options]
 * @returns {Promise<unknown>} parsed JSON body, or null for empty/non-JSON success responses
 * @throws {ApiError | NetworkError | TimeoutError}
 */
export async function request(url, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal: externalSignal,
  } = options;

  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs);

  // Combine timeout and external signals via AbortSignal.any(), with an
  // event-listener bridge for runtimes that don't ship it.
  let combinedSignal;
  let externalListener;
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
    combinedSignal = externalSignal
      ? AbortSignal.any([timeoutController.signal, externalSignal])
      : timeoutController.signal;
  } else {
    combinedSignal = timeoutController.signal;
    if (externalSignal) {
      if (externalSignal.aborted) {
        timeoutController.abort();
      } else {
        externalListener = () => timeoutController.abort();
        externalSignal.addEventListener('abort', externalListener);
      }
    }
  }

  const finalHeaders = { Accept: 'application/json', ...headers };
  let finalBody = body;
  if (isPlainObject(body)) {
    finalBody = JSON.stringify(body);
    if (!('Content-Type' in finalHeaders) && !('content-type' in finalHeaders)) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal: combinedSignal,
    });
  } catch (err) {
    if (timeoutController.signal.aborted && !(externalSignal && externalSignal.aborted)) {
      throw new TimeoutError(`Request to ${url} timed out after ${timeoutMs}ms`, { cause: err });
    }
    throw new NetworkError(`Network error requesting ${url}`, { cause: err });
  } finally {
    clearTimeout(timer);
    if (externalSignal && externalListener) {
      externalSignal.removeEventListener('abort', externalListener);
    }
  }

  if (!response.ok) {
    const errorBody = await readBodySafely(response);
    const message =
      (errorBody && typeof errorBody === 'object' && errorBody.message) ||
      (typeof errorBody === 'string' && errorBody) ||
      response.statusText ||
      `HTTP ${response.status}`;
    throw new ApiError(message, { status: response.status });
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('json')) {
    return readBodySafely(response);
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}
