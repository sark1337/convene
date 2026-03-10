/**
 * ScoutOS Cache Port Client
 * 
 * Gracefully handles missing APP_JWT by falling back to in-memory storage.
 * Works in development, production, and ScoutOS environments.
 */

// TTL in seconds (48 hours)
export const MEETING_TTL_SECONDS = 48 * 60 * 60; // 172800 seconds

// Cache API base URL (same origin, /_ports/cache)
const CACHE_URL = "/_ports/cache";

// In-memory fallback cache
const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

// Check if we can use ScoutOS cache (requires APP_JWT)
function canUseScoutOSCache(): boolean {
  const token = process.env.APP_JWT;
  return !!token && token.length > 0 && token !== "your_scoutos_api_key";
}

// Get auth headers for ScoutOS cache API
function getAuthHeaders(): HeadersInit {
  const token = process.env.APP_JWT;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Set a value with TTL
 */
export async function setWithTTL<T>(
  key: string,
  value: T,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<void> {
  // Always store in memory as backup
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  // Try ScoutOS cache if available
  if (!canUseScoutOSCache()) {
    return;
  }

  try {
    const response = await fetch(`${CACHE_URL}/set`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ key, value, ttl: ttlSeconds }),
    });
    
    if (!response.ok) {
      console.warn("ScoutOS cache set failed:", response.statusText);
    }
  } catch (error) {
    console.warn("ScoutOS cache unavailable, using in-memory:", error);
  }
}

/**
 * Get a value and refresh TTL
 */
export async function getAndRefresh<T>(
  key: string,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<T | null> {
  // Try memory cache first (always available)
  const cached = memoryCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    // Refresh TTL
    cached.expiresAt = Date.now() + ttlSeconds * 1000;
    return cached.value as T;
  }

  // Try ScoutOS cache if available
  if (!canUseScoutOSCache()) {
    return null;
  }

  try {
    const response = await fetch(`${CACHE_URL}/${encodeURIComponent(key)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      console.warn("ScoutOS cache get failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.value !== undefined) {
      // Store in memory for next time
      memoryCache.set(key, {
        value: data.value,
        expiresAt: Date.now() + ttlSeconds * 1000,
      });
      return data.value as T;
    }
    return null;
  } catch (error) {
    console.warn("ScoutOS cache unavailable:", error);
    return null;
  }
}

/**
 * Add to set with TTL
 */
export async function saddWithTTL(
  key: string,
  member: string,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<void> {
  const setKey = `${key}:set`;
  const members = await smembers(key);
  if (!members.includes(member)) {
    members.push(member);
    await setWithTTL(setKey, members, ttlSeconds);
  }
}

/**
 * Get all set members
 */
export async function smembers(key: string): Promise<string[]> {
  const setKey = `${key}:set`;
  const members = await getAndRefresh<string[]>(setKey);
  return members || [];
}

/**
 * Remove from set
 */
export async function srem(key: string, member: string): Promise<void> {
  const setKey = `${key}:set`;
  const members = await smembers(key);
  const filtered = members.filter((m) => m !== member);
  await setWithTTL(setKey, filtered);
}

/**
 * Check if key exists
 */
export async function exists(key: string): Promise<boolean> {
  const cached = memoryCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return true;
  }
  
  if (!canUseScoutOSCache()) {
    return false;
  }

  try {
    const response = await fetch(`${CACHE_URL}/${encodeURIComponent(key)}`, {
      method: "HEAD",
      headers: getAuthHeaders(),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Delete a key
 */
export async function deleteKey(key: string): Promise<void> {
  memoryCache.delete(key);
  memoryCache.delete(`${key}:set`);

  if (!canUseScoutOSCache()) {
    return;
  }

  try {
    await fetch(`${CACHE_URL}/${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore deletion failures
  }
}

/**
 * Get remaining TTL in seconds
 */
export async function getRemainingTTL(key: string): Promise<number> {
  const cached = memoryCache.get(key);
  if (!cached) return 0;
  return Math.max(0, Math.floor((cached.expiresAt - Date.now()) / 1000));
}

/**
 * Set if not exists (for atomic operations)
 */
export async function setIfNotExists<T>(
  key: string,
  value: T,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<boolean> {
  if (await exists(key)) {
    return false;
  }
  await setWithTTL(key, value, ttlSeconds);
  return true;
}

// Export for compatibility
export const redis = null;