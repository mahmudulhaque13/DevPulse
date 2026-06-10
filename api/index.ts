import app from "../src/app";
import { bootDatabase } from "../src/database";

bootDatabase()
  .then(() => console.log("⚡ NeonDB Hydration Active."))
  .catch((err) => console.error("❌ Lazy Sync Failed:", err));

export default app;
