import dotenv from 'dotenv';
import zod from 'zod';

dotenv.config({
  path: `.env`
});

const envSchema = zod.object({
  PORT: zod.string().default("3000"),
  NODE_ENV: zod.enum(["development", "production", "test"]).default("development"),
  DATABASE_URI: zod.string().url(),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(env.error.format());
  process.exit(1);
}


type Env = zod.infer<typeof envSchema>;

export const { PORT, NODE_ENV, DATABASE_URI } = env.data as Env;