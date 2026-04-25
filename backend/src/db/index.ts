import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { ENV } from "../config/env";

if (!ENV.DB_URL) {
  throw new Error("DB_URL is not set in environment variables");
}

//initializa postgreSQL conection string
const pool = new Pool({ connectionString: ENV.DB_URL });

//log when first connection is made
pool.on("connect", () => {
  console.log("Database connected successfully");
});
//log when an error occurs
pool.on("error", (err) => {
  console.log("Database connection error", err);
});

// 👀 What is a Connection Pool?
// A connection pool is a cache of database connections that are kept open and reused.

// 🤷‍♂️ Why use it?
// 🔴 Opening/closing connections is slow. Instead of creating a new connection for each request, we reuse existing ones.
// 🔴 Databases limit concurrent connections. A pool manages a fixed number of connections and shares them across requests.


export const db = drizzle({client: pool, schema}); 
