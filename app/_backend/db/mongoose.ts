// lib/mongoose.ts
import mongoose from "mongoose";

// Define the cached connection type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global object to persist cache across hot reloads (development)
declare global {
  var mongoose: MongooseCache;
}

const MONGODB_URI = process.env.MONGODB_URL!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URL environment variable");
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add other options if needed (e.g., useNewUrlParser, useUnifiedTopology are defaults in newer drivers)
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }

  return cached.conn;
}

// Optional: graceful shutdown
process.on("SIGINT", async () => {
  if (cached.conn) {
    await cached.conn.disconnect();
    console.log("MongoDB disconnected on app termination");
    process.exit(0);
  }
});