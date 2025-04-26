

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:npg_ENo6QK3xZGPM@ep-gentle-sun-a1t540lm-pooler.ap-southeast-1.aws.neon.tech/flow?sslmode=require"
);
export const db = drizzle(sql, { schema });