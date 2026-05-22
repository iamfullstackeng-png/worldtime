import { afterEach, describe, expect, it, vi } from 'vitest';

import { request } from '@/lib/api/client.js';
import { NetworkError, TimeoutError } from '@/lib/api/errors.js';

function jsonResponse(data, { status = 200, statusText = 'OK' } = {}) {
  const body = JSON.stringify(data);
  return new Response(body, {
    status,
    statusText,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('request', () => {
  it('returns parsed JSON on success', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ ok: 1 }));
    const data = await request('https://api.example/x');
    expect(data).toEqual({ ok: 1 });
  });

  it('returns null on 204 No Content', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 204, statusText: 'No Content' }),
    );
    expect(await request('https://api.example/x')).toBeNull();
  });

  it('throws ApiError with status on HTTP 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('boom', { status: 500, statusText: 'Server Error' }),
    );
    await expect(request('https://api.example/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
    });
  });

  it('throws NetworkError when fetch rejects with a TypeError', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('network down'));
    await expect(request('https://api.example/x')).rejects.toBeInstanceOf(NetworkError);
  });

  it('throws TimeoutError when the timeout fires before fetch resolves', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
      return new Promise((_resolve, reject) => {
        if (init?.signal) {
          init.signal.addEventListener('abort', () => {
            const err = new Error('aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    });

    const promise = request('https://api.example/x', { timeoutMs: 50 });
    const settled = promise.then(
      (v) => ({ ok: true, value: v }),
      (e) => ({ ok: false, error: e }),
    );
    await vi.advanceTimersByTimeAsync(60);
    const result = await settled;
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(TimeoutError);
  });

  it('throws NetworkError (not TimeoutError) when the external signal aborts', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
      return new Promise((_resolve, reject) => {
        if (init?.signal) {
          init.signal.addEventListener('abort', () => {
            const err = new Error('aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    });

    const controller = new AbortController();
    const promise = request('https://api.example/x', {
      timeoutMs: 10_000,
      signal: controller.signal,
    });
    queueMicrotask(() => controller.abort());

    await expect(promise).rejects.toBeInstanceOf(NetworkError);
    await expect(promise).rejects.not.toBeInstanceOf(TimeoutError);
  });

  it('serializes a plain-object body to JSON and sets Content-Type', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ ok: 1 }));
    await request('https://api.example/x', {
      method: 'POST',
      body: { hello: 'world' },
    });

    const [, init] = fetchSpy.mock.calls[0];
    expect(init.body).toBe(JSON.stringify({ hello: 'world' }));
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.headers.Accept).toBe('application/json');
    expect(init.method).toBe('POST');
  });
});
