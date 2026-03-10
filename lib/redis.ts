import { Redis } from "@upstash/redis";

// Check if Redis is properly configured
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isRedisConfigured = redisUrl && 
  redisToken && 
  redisUrl.startsWith("https://") && 
  !redisUrl.includes("your_");

// Initialize Redis client only if properly configured
export const redis = isRedisConfigured 
  ? new Redis({
      url: redisUrl!,
      token: redisToken!,
    })
  : null;

if (!isRedisConfigured) {
  console.warn("Redis not configured. Using in-memory fallback for development.");
}

// TTL in seconds (48 hours)
export const MEETING_TTL_SECONDS = 48 * 60 * 60; // 172800 seconds

/**
 * Set a value with TTL (48 hours by default)
 */
export async function setWithTTL<T>(
  key: string,
  value: T,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<void> {
  if (!redis) {
    console.warn("Redis not configured. Skipping set:", key);
    return;
  }
  await redis.set(key, value, { ex: ttlSeconds });
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
  if (!redis) {
    console.warn("Redis not configured. Skipping get:", key);
    return null;
  }
  
  const value = await redis.get<T>(key);
  if (value) {
    // Refresh TTL on access
    await redis.expire(key, ttlSeconds);
  }
  return value;
}

/**
 * Add to set with TTL
 */
export async function saddWithTTL(
  key: string,
  member: string,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<void> {
  if (!redis) return;
  await redis.sadd(key, member);
  await redis.expire(key, ttlSeconds);
}

/**
 * Get all set members
 */
export async function smembers(key: string): Promise<string[]> {
  if (!redis) return [];
  return (await redis.smembers(key)) as string[];
}

/**
 * Remove from set
 */
export async function srem(key: string, member: string): Promise<void> {
  if (!redis) return;
  await redis.srem(key, member);
}

/**
 * Check if key exists
 */
export async function exists(key: string): Promise<boolean> {
  if (!redis) return false;
  return (await redis.exists(key)) === 1;
}

/**
 * Delete a key
 */
export async function deleteKey(key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}

/**
 * Get remaining TTL in seconds
 */
export async function getRemainingTTL(key: string): Promise<number> {
  if (!redis) return 0;
  return await redis.ttl(key);
}

/**
 * Set if not exists (for atomic operations)
 */
export async function setIfNotExists<T>(
  key: string,
  value: T,
  ttlSeconds: number = MEETING_TTL_SECONDS
): Promise<boolean> {
  if (!redis) return false;
  const result = await redis.set(key, value, { ex: ttlSeconds, nx: true });
  return result === "OK";
}