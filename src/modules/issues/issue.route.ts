import { Router } from "express";
import { issueController } from "./issue.controller";
import { checkAuth } from "../../middleware/auth";

export const issueRouter = Router();

issueRouter.post("/", checkAuth, issueController.createIssue);
issueRouter.get("/", issueController.getAllIssues);
issueRouter.get("/:id", issueController.getSingleIssue);
issueRouter.patch("/:id", checkAuth, issueController.updateIssue);
issueRouter.delete("/:id", checkAuth, issueController.deleteIssue);
