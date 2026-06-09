import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { runMigrations } from "../db/migrations";
import { listSessions, createCompletedSession, clearSessions } from "../db/repositories/sessionsRepo";
import { listBuildings, insertBuilding, getNextGridPosition, clearBuildings } from "../db/repositories/buildingsRepo";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "../db/repositories/settingsRepo";
import { pickBuildingType, pickVariantIndex } from "../services/rewardEngine";
import { deriveStats, computeCurrentStreak } from "../services/statsService";
import { AppSettings, AppStats, BuildingRecord, SessionRecord } from "../types/app";

interface AppContextValue {
  ready: boolean;
  loading: boolean;
  sessions: SessionRecord[];
  buildings: BuildingRecord[];
  settings: AppSettings;
  stats: AppStats;
  refresh: () => Promise<void>;
  completeFocusSession: (focusMinutes: number, breakMinutes: number, startedAtIso: string) => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  resetData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const stats = useMemo(() => deriveStats(sessions), [sessions]);

  const refresh = async () => {
    setLoading(true);
    try {
      const [nextSettings, nextSessions, nextBuildings] = await Promise.all([
        getSettings(),
        listSessions(250),
        listBuildings(),
      ]);

      setSettings(nextSettings);
      setSessions(nextSessions);
      setBuildings(nextBuildings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await runMigrations();
      await refresh();
      setReady(true);
    })();
  }, []);

  const completeFocusSession = async (focusMinutes: number, breakMinutes: number, startedAtIso: string) => {
    const endedAtIso = new Date().toISOString();
    const uniqueDays = Array.from(
      new Set([endedAtIso, ...sessions.map((session) => session.endedAt)].map((iso) => iso.slice(0, 10)))
    ).sort((a, b) => b.localeCompare(a));

    const projectedStreak = Math.max(1, computeCurrentStreak(uniqueDays));
    const buildingType = pickBuildingType(focusMinutes, projectedStreak);
    const variantIndex = pickVariantIndex(buildingType, Date.now());

    const sessionId = await createCompletedSession({
      startedAt: startedAtIso,
      endedAt: endedAtIso,
      focusMinutes,
      breakMinutes,
      streakAtCompletion: projectedStreak,
      buildingType,
    });

    const { gridX, gridY } = await getNextGridPosition(settings.cityColumns);

    await insertBuilding({
      sessionId,
      type: buildingType,
      variantIndex,
      gridX,
      gridY,
      createdAt: endedAtIso,
    });

    await refresh();
  };

  const updateSettings = async (partial: Partial<AppSettings>) => {
    await saveSettings(partial);
    await refresh();
  };

  const resetData = async () => {
    await clearBuildings();
    await clearSessions();
    await saveSettings(DEFAULT_SETTINGS);
    await refresh();
  };

  const value: AppContextValue = {
    ready,
    loading,
    sessions,
    buildings,
    settings,
    stats,
    refresh,
    completeFocusSession,
    updateSettings,
    resetData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppProvider");
  }

  return ctx;
}
