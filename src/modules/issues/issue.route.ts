import { Router } from "express";
import { issueController } from "./issue.controller";
import { checkAuth } from "../../middleware/auth";

export const issueRouter = Router();
issueRouter.post("/", checkAuth, issueController.createIssue);
issueRouter.get("/", issueController.getAllIssues);
issueRouter.patch("/:id", checkAuth, issueController.updateIssue);
