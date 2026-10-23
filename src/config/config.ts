import "dotenv/config";

type PropType = {
  DATABASE_URL: string;
  PORT: number;
  ENV: string;
  SESSION_SECRET: string;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined, check env file");
}

if (!process.env.PORT) {
  throw new Error("PORT is not defined, check env file");
}

if (!process.env.ENV) {
  throw new Error("ENV variable not defined, check env file");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET variable not defined, check env file");
}
const config: PropType = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT),
  ENV: process.env.ENV,
  SESSION_SECRET: process.env.SESSION_SECRET,
};

export default config;
