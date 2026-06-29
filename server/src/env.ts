import { env as LoadEnv } from "custom-env";
import { z, ZodError } from "zod";

process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isDevelopement = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "testing";
const isProduction = process.env.APP_STAGE === "production";

if (isDevelopement) {
  LoadEnv();
} else if (isTesting) {
  LoadEnv("test");
}

const envSchema = z.object({
  APP_STAGE: z.enum(["dev", "testing", "production"]).default("dev"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  PASSWORD_SALT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
  ACCESS_TOKEN_SECRET_KEY: z
    .string()
    .min(32, "Access token secret key must be 32 characters long"),
  REFRESH_TOKEN_SECRET_KEY: z
    .string()
    .min(32, "Refresh token secret key must be 32 characters long"),
  ACCESS_TOKEN_EXPIRATION: z.coerce.number().min(1).default(1),
  REFRESH_TOKEN_EXPIRATION: z.coerce.number().min(1).default(7),
});

type EnvType = z.infer<typeof envSchema>;

export let env: EnvType;

try {
  env = envSchema.parse(process.env);
} catch (e) {
  if (e instanceof ZodError) {
    console.log("Invalid ENV variables");
    e.issues.forEach((err) => {
      console.log(`${err.path.join(".")} : ${err.message}`);
    });
    process.exit(1);
  }

  throw e;
}

export const isDev = () => env.NODE_ENV === "development";
export const isTest = () => env.NODE_ENV === "test";
export const isProd = () => env.NODE_ENV === "production";
