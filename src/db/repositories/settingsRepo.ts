import { getDb } from "../client";
import { AppSettings } from "../../types/app";

const DEFAULT_SETTINGS: AppSettings = {
  focusMinutes: 25,
  breakMinutes: 5,
  cityColumns: 5,
};

export async function getSettings(): Promise<AppSettings> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ key: string; value: string }>("SELECT key, value FROM settings;");

  const map = rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return {
    focusMinutes: Number(map.focusMinutes ?? DEFAULT_SETTINGS.focusMinutes),
    breakMinutes: Number(map.breakMinutes ?? DEFAULT_SETTINGS.breakMinutes),
    cityColumns: Number(map.cityColumns ?? DEFAULT_SETTINGS.cityColumns),
  };
}

export async function saveSettings(partial: Partial<AppSettings>): Promise<void> {
  const db = await getDb();

  for (const [key, value] of Object.entries(partial)) {
    if (value === undefined) {
      continue;
    }

    await db.runAsync(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;",
      [key, String(value)]
    );
  }
}

export async function getSettingValue(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>("SELECT value FROM settings WHERE key = ? LIMIT 1;", [key]);
  return row?.value ?? null;
}

export async function setSettingValue(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;",
    [key, value]
  );
}

export { DEFAULT_SETTINGS };
