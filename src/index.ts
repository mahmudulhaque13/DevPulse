import app from "./app";
import { bootDatabase } from "./database";
import { sysConfig } from "./config";

const initializeSystemCore = async (): Promise<void> => {
  await bootDatabase();
  app.listen(sysConfig.envPort, () => {
    console.log(`🚀 Server active on port: ${sysConfig.envPort}`);
  });
};

initializeSystemCore();
