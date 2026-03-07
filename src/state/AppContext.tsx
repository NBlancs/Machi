import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { runMigrations } from "../db/migrations";
import { listSessions, createCompletedSession, clearSessions } from "../db/repositories/sessionsRepo";
import { listBuildings, insertBuilding, getNextGridPosition, clearBuildings } from "../db/repositories/buildingsRepo";
import { DEFAULT_SETTINGS, getSettings, getSettingValue, saveSettings, setSettingValue } from "../db/repositories/settingsRepo";
import { createUser, findUserByLogin, getUserById } from "../db/repositories/usersRepo";
import { pickBuildingType, pickVariantIndex } from "../services/rewardEngine";
import { deriveStats, computeCurrentStreak } from "../services/statsService";
import { AppSettings, AppStats, BuildingRecord, SessionRecord, UserProfile } from "../types/app";

interface AppContextValue {
  ready: boolean;
  loading: boolean;
  sessions: SessionRecord[];
  buildings: BuildingRecord[];
  settings: AppSettings;
  stats: AppStats;
  currentUser: UserProfile | null;
  refresh: () => Promise<void>;
  completeFocusSession: (focusMinutes: number, breakMinutes: number, startedAtIso: string) => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  resetData: () => Promise<void>;
  login: (loginValue: string, password: string) => Promise<boolean>;
  register: (input: Omit<UserProfile, "id"> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [buildings, setBuildings] = useState<BuildingRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const stats = useMemo(() => deriveStats(sessions), [sessions]);

  const refresh = async () => {
    setLoading(true);
    try {
      const [nextSettings, nextSessions, nextBuildings, currentUserId] = await Promise.all([
        getSettings(),
        listSessions(250),
        listBuildings(),
        getSettingValue("currentUserId"),
      ]);

      const nextUser = currentUserId ? await getUserById(Number(currentUserId)) : null;

      setSettings(nextSettings);
      setSessions(nextSessions);
      setBuildings(nextBuildings);
      setCurrentUser(nextUser ? {
        id: nextUser.id,
        email: nextUser.email,
        username: nextUser.username,
        age: nextUser.age,
        gender: nextUser.gender,
      } : null);
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

  const login = async (loginValue: string, password: string) => {
    const user = await findUserByLogin(loginValue, password);
    if (!user) {
      return false;
    }

    await setSettingValue("currentUserId", String(user.id));
    await refresh();
    return true;
  };

  const register = async (input: Omit<UserProfile, "id"> & { password: string }) => {
    try {
      const userId = await createUser({
        email: input.email.trim(),
        username: input.username.trim(),
        password: input.password,
        age: input.age.trim(),
        gender: input.gender.trim(),
      });

      await setSettingValue("currentUserId", String(userId));
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await setSettingValue("currentUserId", "");
    await refresh();
  };

  const resetData = async () => {
    await clearBuildings();
    await clearSessions();
    await saveSettings(DEFAULT_SETTINGS);
    await setSettingValue("currentUserId", "");
    await refresh();
  };

  const value: AppContextValue = {
    ready,
    loading,
    sessions,
    buildings,
    settings,
    stats,
    currentUser,
    refresh,
    completeFocusSession,
    updateSettings,
    resetData,
    login,
    register,
    logout,
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
