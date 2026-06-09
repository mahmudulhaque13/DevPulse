import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export const sysConfig = {
  envPort: process.env.PORT || 5000,
  dbUri: process.env.CONNECTION_STRING,
  jwtSignSecret: process.env.ACCESS_SECRET || "default_vessel_secret_2026",
};
