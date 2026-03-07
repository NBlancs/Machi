import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { AppHeader } from "../components/ui/AppHeader";
import { SectionCard } from "../components/ui/SectionCard";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

export function HistoryScreen() {
  const { sessions } = useAppState();

  return (
    <AppBackground>
      <View style={styles.root}>
        <AppHeader title="HISTORY" subtitle="Your completed focus sessions and earned building types." />
        <FlatList
          data={sessions}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No sessions yet. Complete one in Focus.</Text>}
          renderItem={({ item }) => (
            <SectionCard style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{item.focusMinutes} min focus</Text>
                <Text style={styles.rowSubtitle}>{new Date(item.endedAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.rowBadge}>{item.buildingType}</Text>
            </SectionCard>
          )}
        />
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
  list: {
    paddingTop: 18,
    paddingBottom: 110,
    gap: 10,
  },
  empty: {
    marginTop: tokens.space.lg,
    textAlign: "center",
    color: "#60758A",
    fontFamily: tokens.font.body,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  rowTitle: {
    color: tokens.color.ink,
    fontWeight: "600",
    fontFamily: tokens.font.display,
    fontSize: 16,
  },
  rowSubtitle: {
    marginTop: 4,
    color: "#5C7288",
    fontSize: 12,
  },
  rowBadge: {
    textTransform: "uppercase",
    fontSize: 11,
    fontWeight: "700",
    color: tokens.color.primaryDark,
    fontFamily: tokens.font.bodyBold,
  },
});
