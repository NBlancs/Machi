import { AppStats, SessionRecord } from "../types/app";

function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function deriveStats(sessions: SessionRecord[]): AppStats {
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + s.focusMinutes, 0);
  const completedSessions = sessions.length;

  const uniqueDays = Array.from(new Set(sessions.map((s) => dayKey(s.endedAt)))).sort((a, b) => b.localeCompare(a));

  let bestStreak = 0;
  let runningBest = 0;

  for (let i = 0; i < uniqueDays.length; i += 1) {
    if (i === 0) {
      runningBest = 1;
      bestStreak = 1;
      continue;
    }

    const current = new Date(uniqueDays[i]);
    const previous = new Date(uniqueDays[i - 1]);
    const diff = Math.round((previous.getTime() - current.getTime()) / 86400000);

    if (diff === 1) {
      runningBest += 1;
    } else {
      runningBest = 1;
    }

    bestStreak = Math.max(bestStreak, runningBest);
  }

  const currentStreak = computeCurrentStreak(uniqueDays);

  return {
    totalFocusMinutes,
    completedSessions,
    currentStreak,
    bestStreak,
  };
}

export function computeCurrentStreak(uniqueDaysDesc: string[]): number {
  if (uniqueDaysDesc.length === 0) {
    return 0;
  }

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (uniqueDaysDesc[0] !== todayKey && uniqueDaysDesc[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDaysDesc.length; i += 1) {
    const current = new Date(uniqueDaysDesc[i]);
    const previous = new Date(uniqueDaysDesc[i - 1]);
    const diff = Math.round((previous.getTime() - current.getTime()) / 86400000);

    if (diff === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}
