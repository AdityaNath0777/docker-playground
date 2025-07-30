import * as http from "node:http";
import { pool } from "../db/pg";

const getUsers = async (
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  try {
    const result = await pool.query(`SELECT id, name, email FROM users LIMIT 100`);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(result.rows));
  } catch (err) {
    console.error("Error fetching users:", err);
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Error fetching users" }));
  }
};

export { getUsers };
