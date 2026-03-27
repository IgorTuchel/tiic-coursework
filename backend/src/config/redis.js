/**
 * @file redis.js
 * @description Redis client configuration and initialization.
 * Defines the connection parameters for the Redis store.
 * @module config/redis
 */

import { createClient } from "redis";
import cfg from "./config.js";

/**
 * The configured Redis client instance.
 * @type {ReturnType<typeof createClient>}
 * @description Note: The client is created here but not yet connected.
 * Connection is established in the startup orchestrator.
 * @see https://github.com/redis/node-redis
 */
const redisClient = createClient({
  url: "redis://" + cfg.redisHost + ":" + cfg.redisPort,
});

export async function verifyRedisConnection() {
  try {
    await redisClient.connect();
    await redisClient.ping();
    await redisClient.setEx("redis_test_key", 60, "test_value");
    const value = await redisClient.get("redis_test_key");
    if (value === "test_value") {
      return {
        message: "Redis connection verified",
        successful: true,
        data: { response: "Ping successful, test key set and retrieved" },
      };
    } else {
      return {
        message: "Redis connection failed: Test key mismatch",
        successful: false,
        data: { error: "Expected 'test_value', got '" + value + "'" },
      };
    }
  } catch (err) {
    return {
      message: "Redis connection failed with exception",
      successful: false,
      data: { error: err.message },
    };
  }
}

export default redisClient;
