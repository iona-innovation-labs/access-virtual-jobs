import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/database/schema";

// Detect if you're using Neon or Local Postgres
const isNeon = process.env.DATABASE_URL?.includes("neon.tech");

export const db = isNeon
  ? drizzleNeon(neon(process.env.DATABASE_URL!), { schema })
  : drizzlePg(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema });
