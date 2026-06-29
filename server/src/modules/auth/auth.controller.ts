import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";

import db from "../../db/connection.ts";
import { users } from "../../db/schema.ts";
import { hashPassword, comparePassword } from "../../utils/password.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.ts";
import { env } from "../../env.ts";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const refreshToken = generateRefreshToken(user.id);
    const accessToken = generateAccessToken(user.id, user.username);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_EXPIRATION,
    });

    return res.json({
      message: "Login successful. Welcome back!",
      accessToken: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({ email, username, password: hashedPassword })
      .returning();

    const refreshToken = generateRefreshToken(user.id);
    const accessToken = generateAccessToken(user.id, user.username);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * env.REFRESH_TOKEN_EXPIRATION,
    });

    return res.json({
      message: "Registration successful. Your account has been created.",
      accessToken: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(401).json({
        message: "Authentication token is missing.",
      });
    }

    const userPayload = verifyRefreshToken(refresh_token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userPayload.id));

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const accessToken = generateAccessToken(user.id, user.username);

    return res.json({
      message: "Session refreshed successfully.",
      accessToken: accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (_: any, res: Response, next: NextFunction) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    return res.json({
      message: "Logged out successfully.",
    });
  } catch (e) {
    next(e);
  }
};
