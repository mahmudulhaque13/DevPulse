import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.route";
import { issueRouter } from "./modules/issues/issue.route";
import { userRouter } from "./modules/users/user.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ success: true, message: "DevPulse API Engine Operational." });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
