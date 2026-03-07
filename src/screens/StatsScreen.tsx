import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { AppHeader } from "../components/ui/AppHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <SectionCard style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </SectionCard>
  );
}

export function StatsScreen() {
  const { stats } = useAppState();

  return (
    <AppBackground>
      <View style={styles.root}>
        <AppHeader title="STATS" subtitle="Track your focus time, streaks, and overall momentum." />
        <View style={styles.grid}>
          <StatCard label="Focus Minutes" value={stats.totalFocusMinutes} />
          <StatCard label="Completed Sessions" value={stats.completedSessions} />
          <StatCard label="Current Streak" value={`${stats.currentStreak} days`} />
          <StatCard label="Best Streak" value={`${stats.bestStreak} days`} />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 44,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: tokens.space.sm,
    marginTop: 18,
  },
  statCard: {
    width: "48%",
  },
  statLabel: {
    color: "#5E7388",
    fontSize: 12,
    textTransform: "uppercase",
    fontFamily: tokens.font.body,
  },
  statValue: {
    marginTop: 6,
    color: tokens.color.primaryDark,
    fontFamily: tokens.font.display,
    fontSize: 24,
    fontWeight: "700",
  },
});
