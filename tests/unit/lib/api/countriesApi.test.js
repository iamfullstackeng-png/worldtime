import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApiError, NetworkError } from '@/lib/api/errors.js';

vi.mock('@/lib/api/client.js', () => ({
  request: vi.fn(),
}));

const { request } = await import('@/lib/api/client.js');
const { getCountries } = await import('@/lib/api/countriesApi.js');
const { ENDPOINTS } = await import('@/lib/api/endpoints.js');

afterEach(() => {
  vi.mocked(request).mockReset();
});

describe('getCountries', () => {
  it('returns normalized v2 data when v2 succeeds', async () => {
    vi.mocked(request).mockResolvedValueOnce([
      { name: 'Pakistan', region: 'Asia', flag: 'https://flagcdn.com/pk.svg' },
    ]);

    const result = await getCountries();

    expect(result).toEqual([
      { name: 'Pakistan', region: 'Asia', flag: 'https://flagcdn.com/pk.svg' },
    ]);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith(ENDPOINTS.COUNTRIES_V2, { signal: undefined });
  });

  it('falls back to v3 when v2 throws ApiError, normalizing to v2 shape', async () => {
    vi.mocked(request)
      .mockRejectedValueOnce(new ApiError('v2 down', { status: 503 }))
      .mockResolvedValueOnce([
        {
          name: { common: 'Pakistan' },
          region: 'Asia',
          flags: { svg: 'https://flagcdn.com/pk.svg', png: 'https://flagcdn.com/pk.png' },
        },
      ]);

    const result = await getCountries();
    expect(result).toEqual([
      { name: 'Pakistan', region: 'Asia', flag: 'https://flagcdn.com/pk.svg' },
    ]);
    expect(request).toHaveBeenNthCalledWith(2, ENDPOINTS.COUNTRIES_V3, { signal: undefined });
  });

  it('v3 prefers flags.svg when both svg and png are present', async () => {
    vi.mocked(request)
      .mockRejectedValueOnce(new ApiError('v2 down', { status: 503 }))
      .mockResolvedValueOnce([
        {
          name: { common: 'X' },
          region: 'Y',
          flags: { svg: 'svg.url', png: 'png.url' },
        },
      ]);

    const result = await getCountries();
    expect(result[0].flag).toBe('svg.url');
  });

  it('v3 falls back to flags.png when flags.svg is absent', async () => {
    vi.mocked(request)
      .mockRejectedValueOnce(new ApiError('v2 down', { status: 503 }))
      .mockResolvedValueOnce([
        {
          name: { common: 'X' },
          region: 'Y',
          flags: { png: 'png.url' },
        },
      ]);

    const result = await getCountries();
    expect(result[0].flag).toBe('png.url');
  });

  it('rethrows the v3 error when both v2 and v3 fail', async () => {
    vi.mocked(request)
      .mockRejectedValueOnce(new ApiError('v2 down', { status: 503 }))
      .mockRejectedValueOnce(new ApiError('v3 also down', { status: 502 }));

    await expect(getCountries()).rejects.toMatchObject({
      name: 'ApiError',
      message: 'v3 also down',
      status: 502,
    });
  });

  it('does not fall back when v2 throws a non-Api error (e.g. NetworkError stays raised)', async () => {
    // NetworkError extends ApiError, so it DOES trigger fallback by the spec.
    // This test pins behavior for a non-ApiError (e.g. a programming bug).
    vi.mocked(request).mockRejectedValueOnce(new RangeError('bug'));
    await expect(getCountries()).rejects.toBeInstanceOf(RangeError);
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('falls back when v2 raises NetworkError (a subclass of ApiError)', async () => {
    vi.mocked(request)
      .mockRejectedValueOnce(new NetworkError('offline'))
      .mockResolvedValueOnce([
        { name: { common: 'Z' }, region: 'Europe', flags: { svg: 'z.svg' } },
      ]);

    const result = await getCountries();
    expect(result).toEqual([{ name: 'Z', region: 'Europe', flag: 'z.svg' }]);
  });

  it('forwards the caller signal to both v2 and v3 requests', async () => {
    const controller = new AbortController();
    vi.mocked(request)
      .mockRejectedValueOnce(new ApiError('v2 down', { status: 503 }))
      .mockResolvedValueOnce([]);

    await getCountries({ signal: controller.signal });

    expect(request).toHaveBeenNthCalledWith(1, ENDPOINTS.COUNTRIES_V2, {
      signal: controller.signal,
    });
    expect(request).toHaveBeenNthCalledWith(2, ENDPOINTS.COUNTRIES_V3, {
      signal: controller.signal,
    });
  });
});
