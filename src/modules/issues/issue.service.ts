import { pool } from "../../database";

const createIssueIntoDB = async (payload: any, reporterId: number) => {
  const { title, description, type } = payload;

  const cleanTitle = title?.trim();
  const cleanDescription = description?.trim();
  const cleanType = type?.trim();

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [cleanTitle, cleanDescription, cleanType, reporterId],
  );
  return result.rows[0];
};

const getAllIssuesFromDB = async (filters: any) => {
  const { type, status, sort } = filters;
  let queryStr = "SELECT * FROM issues WHERE 1=1";
  const params: any[] = [];
  let index = 1;

  if (type) {
    queryStr += ` AND type = $${index++}`;
    params.push(type);
  }
  if (status) {
    queryStr += ` AND status = $${index++}`;
    params.push(status);
  }

  queryStr += ` ORDER BY created_at ${sort === "oldest" ? "ASC" : "DESC"}`;
  const issuesResult = await pool.query(queryStr, params);
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  const userIds = Array.from(new Set(issues.map((i) => i.reporter_id)));
  const usersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [userIds],
  );

  const userMap = usersResult.rows.reduce((acc: any, user: any) => {
    acc[user.id] = user;
    return acc;
  }, {});

  return issues.map(({ reporter_id, ...issueData }) => ({
    ...issueData,
    reporter: userMap[reporter_id] || null,
  }));
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  if (issueResult.rows.length === 0) {
    const error: any = new Error("Issue not found!");
    error.statusCode = 404;
    throw error;
  }

  const issue = issueResult.rows[0];

  const userResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [issue.reporter_id],
  );

  const { reporter_id, ...issueData } = issue;
  return {
    ...issueData,
    reporter: userResult.rows[0] || null,
  };
};

const updateIssueInDB = async (id: string, payload: any, currentUser: any) => {
  const targetIssue = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  if (targetIssue.rows.length === 0) {
    const error: any = new Error("Issue not found!");
    error.statusCode = 404;
    throw error;
  }

  const issue = targetIssue.rows[0];

  if (currentUser.role !== "maintainer") {
    if (issue.reporter_id !== currentUser.id) {
      const error: any = new Error("Unauthorized access.");
      error.statusCode = 403;
      throw error;
    }
    if (issue.status !== "open") {
      const error: any = new Error("Cannot edit non-open issue.");
      error.statusCode = 400;
      throw error;
    }
    if (payload.status && payload.status !== issue.status) {
      const error: any = new Error("Contributors cannot change status.");
      error.statusCode = 400;
      throw error;
    }
  }

  const result = await pool.query(
    `UPDATE issues 
     SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), status = COALESCE($4, status), updated_at = NOW() 
     WHERE id = $5 RETURNING *`,
    [payload.title, payload.description, payload.type, payload.status, id],
  );
  return result.rows[0];
};

const deleteIssueFromDB = async (id: string, currentUser: any) => {
  const targetIssue = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  if (targetIssue.rows.length === 0) {
    const error: any = new Error("Issue not found!");
    error.statusCode = 404;
    throw error;
  }

  const issue = targetIssue.rows[0];

  if (
    currentUser.role !== "maintainer" &&
    issue.reporter_id !== currentUser.id
  ) {
    const error: any = new Error("Unauthorized access to delete this issue.");
    error.statusCode = 403;
    throw error;
  }

  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
  return { id };
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueInDB,
  deleteIssueFromDB,
};
