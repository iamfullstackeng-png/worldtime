import { request } from './client.js';
import { ENDPOINTS } from './endpoints.js';
import { ApiError } from './errors.js';

// REST Countries v2 has been intermittently unstable for over a year. The brief
// names v2 as the source of truth, so we try v2 first to honor that contract,
// then fall back to v3.1 if v2 fails for any API reason (HTTP error, malformed
// payload, etc.). v2 and v3.1 have different response shapes, so this module is
// also the single place where both shapes get normalized to the same
// `{ name, region, flag }` object the rest of the app sees.

function normalizeV2(raw) {
  if (!Array.isArray(raw)) {
    throw new ApiError('Malformed v2 response: expected an array', { status: 200 });
  }
  return raw.map((c) => ({
    name: c?.name ?? '',
    region: c?.region ?? '',
    flag: c?.flag ?? '',
  }));
}

function normalizeV3(raw) {
  if (!Array.isArray(raw)) {
    throw new ApiError('Malformed v3 response: expected an array', { status: 200 });
  }
  return raw.map((c) => ({
    name: c?.name?.common ?? '',
    region: c?.region ?? '',
    flag: c?.flags?.svg || c?.flags?.png || '',
  }));
}

/**
 * Returns the list of countries with a stable shape.
 *
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<Array<{ name: string, region: string, flag: string }>>}
 * @throws {ApiError | NetworkError | TimeoutError}
 */
export async function getCountries({ signal } = {}) {
  try {
    const v2 = await request(ENDPOINTS.COUNTRIES_V2, { signal });
    return normalizeV2(v2);
  } catch (v2Error) {
    if (!(v2Error instanceof ApiError)) {
      throw v2Error;
    }
    const v3 = await request(ENDPOINTS.COUNTRIES_V3, { signal });
    return normalizeV3(v3);
  }
}
