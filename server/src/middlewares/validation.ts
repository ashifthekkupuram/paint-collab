import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateBody = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validateBody = schema.parse(req.body);
      req.body = validateBody;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: "Invalid Field",
          details: e.issues.map((err) => ({
            name: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(e);
    }
  };
};
