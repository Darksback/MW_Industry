import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create the connection using the pooled connection string
const sql = neon(process.env.DATABASE_URL!);

// Export the db client
export const db = drizzle(sql, { schema });
