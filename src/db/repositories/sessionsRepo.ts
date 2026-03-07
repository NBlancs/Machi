import { getDb } from "../client";
import { BuildingBucket, SessionRecord } from "../../types/app";

interface CreateSessionInput {
  startedAt: string;
  endedAt: string;
  focusMinutes: number;
  breakMinutes: number;
  streakAtCompletion: number;
  buildingType: BuildingBucket;
}

export async function createCompletedSession(input: CreateSessionInput): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO sessions (started_at, ended_at, focus_minutes, break_minutes, streak_at_completion, building_type)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      input.startedAt,
      input.endedAt,
      input.focusMinutes,
      input.breakMinutes,
      input.streakAtCompletion,
      input.buildingType,
    ]
  );

  return result.lastInsertRowId;
}

export async function listSessions(limit = 100): Promise<SessionRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: number;
    started_at: string;
    ended_at: string;
    focus_minutes: number;
    break_minutes: number;
    streak_at_completion: number;
    building_type: BuildingBucket;
  }>(
    `SELECT id, started_at, ended_at, focus_minutes, break_minutes, streak_at_completion, building_type
     FROM sessions
     ORDER BY ended_at DESC
     LIMIT ?;`,
    [limit]
  );

  return rows.map((row) => ({
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    focusMinutes: row.focus_minutes,
    breakMinutes: row.break_minutes,
    streakAtCompletion: row.streak_at_completion,
    buildingType: row.building_type,
  }));
}

export async function clearSessions(): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM sessions;");
}
