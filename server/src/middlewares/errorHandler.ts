import type { Request, Response, NextFunction } from "express";
import { DrizzleQueryError } from "drizzle-orm";
import { DatabaseError } from "pg";

import { env } from "../env.ts";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      err instanceof DrizzleQueryError &&
      err.cause instanceof DatabaseError
    ) {
      // Unique Error
      if (err.cause.code === "23505") {
        // Email Unique Error
        if (err.cause.constraint === "users_email_unique") {
          return res.status(400).json({
            error: "Validation Error.",
            details: [
              {
                name: "email",
                message: "User with the email already exist.",
              },
            ],
          });
        }
        // Username unique Error
        if (err.cause.constraint === "users_username_unique") {
          return res.status(400).json({
            error: "Validation Error.",
            details: [
              {
                name: "username",
                message: "Username is taken.",
              },
            ],
          });
        }
      }
    }

    let status = 500;
    let error = "Internal Server Error";
    let stack = "";

    if (err instanceof Error) {
      error = err.message;
      stack = err.stack || "";
    }

    return res.status(status).json({
      error,
      ...(env.NODE_ENV === "development" && {
        stack,
      }),
    });
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Error",
      ...(env.NODE_ENV === "development" && {
        stack: e instanceof Error ? e.stack : "",
      }),
    });
  }
};
