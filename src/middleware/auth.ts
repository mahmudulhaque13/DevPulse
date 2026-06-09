import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sysConfig } from "../config";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authorized!" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, sysConfig.jwtSignSecret) as any;
    req.user = { id: decoded.id, name: decoded.name, role: decoded.role };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Token is invalid or expired!" });
  }
};

export const checkRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden access! Insufficient permissions.",
        });
    }
    next();
  };
};
