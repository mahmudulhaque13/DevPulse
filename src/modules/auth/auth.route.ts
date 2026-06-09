import { Router } from "express";
import { authController } from "./auth.controller";

export const authRouter = Router();
authRouter.post("/signup", authController.createAccount);
authRouter.post("/login", authController.sessionLogin);
