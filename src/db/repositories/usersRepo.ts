import { getDb } from "../client";

export interface UserRecord {
  id: number;
  email: string;
  username: string;
  password: string;
  age: string;
  gender: string;
}

export async function createUser(input: Omit<UserRecord, "id">): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO users (email, username, password, age, gender)
     VALUES (?, ?, ?, ?, ?);`,
    [input.email, input.username, input.password, input.age, input.gender]
  );

  return result.lastInsertRowId;
}

export async function findUserByLogin(login: string, password: string): Promise<UserRecord | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<UserRecord>(
    `SELECT id, email, username, password, age, gender
     FROM users
     WHERE (LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)) AND password = ?
     LIMIT 1;`,
    [login, login, password]
  );

  return row ?? null;
}

export async function getUserById(id: number): Promise<UserRecord | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<UserRecord>(
    `SELECT id, email, username, password, age, gender FROM users WHERE id = ? LIMIT 1;`,
    [id]
  );

  return row ?? null;
}
