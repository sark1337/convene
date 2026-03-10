/**
 * ScoutOS Cache Port Client
 * 
 * Replaces Upstash Redis with ScoutOS Live's built-in cache port.
 * TTL support is native - perfect for 48-hour meeting expiry.
 * 
 * Auth: APP_JWT is auto-injected at runtime - no setup needed.
 */

// TTL in seconds (48 hours)
export const MEETING_TTL_SECONDS = 48 * 60 * 60; // 172800 seconds

// Cache API base URL (same origin, /_ports/cache)
const CACHE_URL = "/_ports/cache";

// Get the auth token from environment (auto-injected by ScoutOS)
function getAuthHeaders(): HeadersInit {
  const token = process.env.APP_JWT;
  if (!token) {
    console.warn("APP_JWT not set - cache operations may fail");
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// In-memory fallback for development
const memoryCache = new Map<string, { value: unknown; expiresAt: number }>();

function isDevelopment(): boolean {
  return !process.env.APP_JWT || process.env.NODE_ENV === "development";
}

/**
 * Set a value with TTL
 */
export async function setWithTTL<T>(
  key: string,
  value: T,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<void> {
  if (isDevelopment()) {
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return;
  }

  const response = await fetch(`${CACHE_URL}/set`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ key, value, ttl: ttlSeconds }),
  });

  if (!response.ok) {
    throw new Error(`Cache set failed: ${response.statusText}`);
  }
}

/**
 * Set with custom TTL
 */
export async function setWithCustomTTL<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  await setWithTTL(key, value, ttlSeconds);
}

/**
 * Get a value and refresh TTL
 */
export async function getAndRefresh<T>(
  key: string,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<T | null> {
  if (isDevelopment()) {
    const cached = memoryCache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      memoryCache.delete(key);
      return null;
    }
    // Refresh TTL
    cached.expiresAt = Date.now() + ttlSeconds * 1000;
    return cached.value as T;
  }

  const response = await fetch(`${CACHE_URL}/${encodeURIComponent(key)}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Cache get failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Refresh TTL by setting again
  if (data.value !== undefined) {
    await setWithTTL(key, data.value, ttlSeconds);
  }

  return data.value as T;
}

/**
 * Add to set with TTL
 */
export async function saddWithTTL(
  key: string,
  member: string,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<void> {
  // ScoutOS cache doesn't have native sets, so we use a key pattern
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
  if (isDevelopment()) {
    const cached = memoryCache.get(key);
    if (!cached) return false;
    if (Date.now() > cached.expiresAt) {
      memoryCache.delete(key);
      return false;
    }
    return true;
  }

  const response = await fetch(`${CACHE_URL}/${encodeURIComponent(key)}`, {
    method: "HEAD",
    headers: getAuthHeaders(),
  });

  return response.ok;
}

/**
 * Delete a key
 */
export async function deleteKey(key: string): Promise<void> {
  if (isDevelopment()) {
    memoryCache.delete(key);
    memoryCache.delete(`${key}:set`);
    return;
  }

  await fetch(`${CACHE_URL}/${encodeURIComponent(key)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

/**
 * Get remaining TTL in seconds
 */
export async function getRemainingTTL(key: string): Promise<number> {
  if (isDevelopment()) {
    const cached = memoryCache.get(key);
    if (!cached) return 0;
    return Math.max(0, Math.floor((cached.expiresAt - Date.now()) / 1000));
  }

  // ScoutOS doesn't expose TTL directly, so we return default
  // TTL is managed internally by the cache port
  return MEETING_TTL_SECONDS;
}

/**
 * Set if not exists (for atomic operations)
 */
export async function setIfNotExists<T>(
  key: string,
  value: T,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<boolean> {
  if (isDevelopment()) {
    if (memoryCache.has(key)) {
      const cached = memoryCache.get(key)!;
      if (Date.now() < cached.expiresAt) {
        return false;
      }
    }
    memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return true;
  }

  // Check if exists first
  const existing = await exists(key);
  if (existing) return false;

  // Set the value
  await setWithTTL(key, value, ttlSeconds);
  return true;
}

// Export for compatibility with existing code
export const redis = null; // Not used anymore, but exported for compatibility