import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT),
  HOST: process.env.HOST,
  MONGO_URL: process.env.MONGO_URL,
  HASH_PASSWORD_ROUNDS: Number(process.env.HASH_PASSWORD_ROUNDS),
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
};
