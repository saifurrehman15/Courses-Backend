import { createClient } from "redis";

const redisConfig = {
  url: process.env.REDIS_URL,
};

const client = createClient(redisConfig);

client.on("error", (err) =>
  console.error(`Redis Client Error: ${err.message}`)
);

async function connectRedis() {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.info("Successfully connected to Redis");
    }
  } catch (err) {
    console.error(`Failed to connect to Redis: ${err.message}`);
    throw err;
  }
}

export { client, connectRedis };
