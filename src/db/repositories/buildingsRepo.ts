import { getDb } from "../client";
import { BuildingBucket, BuildingRecord } from "../../types/app";

interface InsertBuildingInput {
  sessionId: number;
  type: BuildingBucket;
  variantIndex: number;
  gridX: number;
  gridY: number;
  createdAt: string;
}

export async function insertBuilding(input: InsertBuildingInput): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO buildings (session_id, type, variant_index, grid_x, grid_y, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [input.sessionId, input.type, input.variantIndex, input.gridX, input.gridY, input.createdAt]
  );
}

export async function listBuildings(): Promise<BuildingRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: number;
    session_id: number;
    type: BuildingBucket;
    variant_index: number;
    grid_x: number;
    grid_y: number;
    created_at: string;
  }>(
    `SELECT id, session_id, type, variant_index, grid_x, grid_y, created_at
     FROM buildings
     ORDER BY created_at ASC;`
  );

  return rows.map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    type: row.type,
    variantIndex: row.variant_index,
    gridX: row.grid_x,
    gridY: row.grid_y,
    createdAt: row.created_at,
  }));
}

export async function getNextGridPosition(columns: number): Promise<{ gridX: number; gridY: number }> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ total: number }>("SELECT COUNT(*) AS total FROM buildings;");
  const total = row?.total ?? 0;

  return {
    gridX: total % columns,
    gridY: Math.floor(total / columns),
  };
}

export async function clearBuildings(): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM buildings;");
}
