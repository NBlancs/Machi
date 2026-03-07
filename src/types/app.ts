export type BuildingBucket = "short" | "medium" | "long" | "skyscraper";

export interface SessionRecord {
  id: number;
  startedAt: string;
  endedAt: string;
  focusMinutes: number;
  breakMinutes: number;
  streakAtCompletion: number;
  buildingType: BuildingBucket;
}

export interface BuildingRecord {
  id: number;
  sessionId: number;
  type: BuildingBucket;
  variantIndex: number;
  gridX: number;
  gridY: number;
  createdAt: string;
}

export interface AppSettings {
  focusMinutes: number;
  breakMinutes: number;
  cityColumns: number;
}

export interface AppStats {
  totalFocusMinutes: number;
  completedSessions: number;
  currentStreak: number;
  bestStreak: number;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  age: string;
  gender: string;
}
