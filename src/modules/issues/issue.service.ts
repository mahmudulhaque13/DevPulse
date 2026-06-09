import { pool } from "../../database";

const createIssueIntoDB = async (payload: any, reporterId: number) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, type, reporterId],
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

const updateIssueInDB = async (id: string, payload: any, currentUser: any) => {
  const targetIssue = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  if (targetIssue.rows.length === 0) throw new Error("Issue not found!");

  const issue = targetIssue.rows[0];

  if (currentUser.role !== "maintainer") {
    if (issue.reporter_id !== currentUser.id)
      throw new Error("Unauthorized access.");
    if (issue.status !== "open") throw new Error("Cannot edit non-open issue.");
    if (payload.status && payload.status !== issue.status)
      throw new Error("Contributors cannot change status.");
  }

  const result = await pool.query(
    `UPDATE issues 
     SET title = COALESCE($1, title), description = COALESCE($2, description), type = COALESCE($3, type), status = COALESCE($4, status), updated_at = NOW() 
     WHERE id = $5 RETURNING *`,
    [payload.title, payload.description, payload.type, payload.status, id],
  );
  return result.rows[0];
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  updateIssueInDB,
};
