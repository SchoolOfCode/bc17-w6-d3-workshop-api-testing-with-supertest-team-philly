import { pool } from "../db/index.js";
//SQL Insertions 
export async function getUsers() {
  const data = await pool.query("SELECT * FROM users ORDER BY id;");
  return data.rows;
}

export async function getUsersByUsername(nameToFind) {
  const data = await pool.query(
    "SELECT * FROM users WHERE username ILIKE '%' || $1 || '%' ORDER BY id;",
    [nameToFind]
  );
  return data.rows;
}

export async function getUserById(userId) {
  const data = await pool.query("SELECT * FROM users WHERE id = $1;", [userId]);
  return data.rows[0];
}

export async function createUser(user) {
  const data = await pool.query(
    "INSERT INTO users (username) VALUES ($1) RETURNING *;",
    [user.username]
  );
  return data.rows[0];
}

export async function deleteUserById(userId) {
  const data = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *;",
    [userId]
  );
  return data.rows[0];
}
