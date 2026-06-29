import jwt from "jsonwebtoken";

import { env } from "../env.ts";

export const generateAccessToken = (id: string, username: string) => {
  return jwt.sign({ id, username }, env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: 1000 * 60 * 60 * 24 * env.ACCESS_TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_EXPIRATION,
  });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET_KEY);
};
