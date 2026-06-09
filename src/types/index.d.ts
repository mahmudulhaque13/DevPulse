import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: "contributor" | "maintainer";
      };
    }
  }
}
