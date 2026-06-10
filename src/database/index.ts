import pg from "pg";
const { Pool } = pg;
import { sysConfig } from "../config";

export const pool = new Pool({
  connectionString: sysConfig.dbUri,
  ssl: { rejectUnauthorized: false },
});

export const bootDatabase = async (): Promise<void> => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor' NOT NULL CHECK (role IN ('contributor', 'maintainer')), 
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL CHECK (LENGTH(TRIM(description)) >= 20),
        type TEXT NOT NULL CHECK (type IN ('bug', 'feature_request')),
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
};
