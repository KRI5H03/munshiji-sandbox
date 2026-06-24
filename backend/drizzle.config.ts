import { defineConfig } from "drizzle-kit";
import { env } from "./env.js";

export default defineConfig({
  schema: "./src/db/schema",
  dialect: "postgresql",
  out: "./migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
