import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsersFromDB();
    res
      .status(200)
      .json({
        success: true,
        message: "Users retrieved successfully!",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

export const userController = { getAllUsers };
