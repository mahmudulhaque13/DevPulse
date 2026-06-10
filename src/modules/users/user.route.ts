import { Router } from "express";
import { userController } from "./user.controller";
import { checkAuth, checkRole } from "../../middleware/auth";

export const userRouter = Router();
userRouter.get(
  "/",
  checkAuth,
  checkRole("maintainer"),
  userController.getAllUsers,
);
