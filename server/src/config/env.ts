import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URI: z.string().url(),
  CORS_ORIGIN: z.string().default("*"),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_EXPIRATION: z.enum([
    "15m",
    "30m",
    "1h",
    "7d",
  ]),

  JWT_REFRESH_EXPIRATION: z.enum([
    "7d",
    "30d",
  ]),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(env.error.format());
  process.exit(1);
}


type Env = z.infer<typeof envSchema>;

export const { PORT, NODE_ENV, DATABASE_URI, CORS_ORIGIN, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } = env.data as Env;