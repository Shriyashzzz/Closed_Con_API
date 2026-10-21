import "dotenv/config";

type PropType = {
  DATABASE_URL: string;
  PORT: number;
  ENV: string;
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

const config: PropType = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT),
  ENV: process.env.ENV,
};

export default config;
