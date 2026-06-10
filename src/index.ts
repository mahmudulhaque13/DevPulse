import app from "./app";
import { bootDatabase } from "./database";

bootDatabase()
  .then(() => {
    console.log("Database hydration complete.");
  })
  .catch((err) => {
    console.error("Pre-runtime database sync failed:", err);
  });

export default app;
