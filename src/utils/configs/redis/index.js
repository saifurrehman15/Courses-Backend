export { client, connectRedis };

import { createClient } from "redis";

const client = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

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