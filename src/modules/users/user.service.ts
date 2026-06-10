import { pool } from "../../database";

const getAllUsersFromDB = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM users ORDER BY id DESC`,
  );
  return result.rows;
};

export const userService = { getAllUsersFromDB };
