import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../database";
import { sysConfig } from "../../config";

const signupIntoDB = async (payload: any) => {
  const { name, email, password, role } = payload;
  const securePassword = await bcrypt.hash(password, 10);
  const defaultRole = role || "contributor";

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, securePassword, defaultRole],
  );
  delete result.rows[0].password;
  return result.rows[0];
};

const loginUser = async (payload: any) => {
  const { email, password } = payload;
  const userExist = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userExist.rows.length === 0) throw new Error("Invalid credentials.");

  const user = userExist.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials.");

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    sysConfig.jwtSignSecret,
    { expiresIn: "1d" },
  );
  delete user.password;
  return { token, user };
};

export const authService = { signupIntoDB, loginUser };
