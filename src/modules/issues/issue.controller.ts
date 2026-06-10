import type { Request, Response, NextFunction } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reporterId = req.user?.id as number;
    const result = await issueService.createIssueIntoDB(req.body, reporterId);
    res
      .status(201)
      .json({
        success: true,
        message: "Issue created successfully!",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);
    res
      .status(200)
      .json({
        success: true,
        message: "Issues retrieved successfully!",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(id as string);
    res
      .status(200)
      .json({
        success: true,
        message: "Issue details retrieved successfully!",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await issueService.updateIssueInDB(
      id as string,
      req.body,
      req.user,
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Issue updated successfully!",
        data: result,
      });
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await issueService.deleteIssueFromDB(id as string, req.user);
    res
      .status(200)
      .json({ success: true, message: "Issue deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
