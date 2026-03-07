import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { AppHeader } from "../components/ui/AppHeader";
import { MachiButton } from "../components/ui/MachiButton";
import { SectionCard } from "../components/ui/SectionCard";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

export function SettingsScreen() {
  const { settings, updateSettings, resetData, logout, currentUser } = useAppState();
  const [focusMinutes, setFocusMinutes] = useState(String(settings.focusMinutes));
  const [breakMinutes, setBreakMinutes] = useState(String(settings.breakMinutes));
  const [cityColumns, setCityColumns] = useState(String(settings.cityColumns));

  useEffect(() => {
    setFocusMinutes(String(settings.focusMinutes));
    setBreakMinutes(String(settings.breakMinutes));
    setCityColumns(String(settings.cityColumns));
  }, [settings.breakMinutes, settings.cityColumns, settings.focusMinutes]);

  const handleSave = async () => {
    await updateSettings({
      focusMinutes: Math.max(5, Number(focusMinutes) || settings.focusMinutes),
      breakMinutes: Math.max(1, Number(breakMinutes) || settings.breakMinutes),
      cityColumns: Math.max(3, Math.min(8, Number(cityColumns) || settings.cityColumns)),
    });

    Alert.alert("Saved", "Your Machi defaults were updated.");
  };

  const handleReset = () => {
    Alert.alert("Reset local data?", "This clears all sessions and buildings stored in SQLite.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          void resetData();
        },
      },
    ]);
  };

  return (
    <AppBackground>
      <View style={styles.root}>
        <AppHeader title="SETTINGS" subtitle="Adjust your local defaults and account state." />

        <SectionCard style={styles.card}>
          <Text style={styles.helper}>Signed in as {currentUser?.username || "local user"}</Text>
          <Text style={styles.label}>Default focus minutes</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={focusMinutes} onChangeText={setFocusMinutes} />
          <Text style={styles.label}>Default break minutes</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={breakMinutes} onChangeText={setBreakMinutes} />
          <Text style={styles.label}>City columns</Text>
          <TextInput style={styles.input} keyboardType="number-pad" value={cityColumns} onChangeText={setCityColumns} />
        </SectionCard>

        <MachiButton label="SAVE" onPress={() => void handleSave()} style={styles.primaryCta} />
        <Pressable style={[styles.button, styles.dangerButton]} onPress={handleReset}>
          <Text style={styles.primaryText}>Reset Local Data</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => void logout()}>
          <Text style={styles.secondaryText}>Log Out</Text>
        </Pressable>
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
  card: {
    marginTop: 18,
  },
  label: {
    color: tokens.color.primaryDark,
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: tokens.font.display,
  },
  helper: {
    marginBottom: tokens.space.md,
    color: "#5F7489",
  },
  input: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: tokens.space.md,
    backgroundColor: "#F8FCFF",
  },
  button: {
    marginTop: tokens.space.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingVertical: 14,
  },
  primaryCta: {
    width: 175,
    alignSelf: "center",
    marginTop: 18,
  },
  primaryButton: {
    backgroundColor: tokens.color.primary,
  },
  dangerButton: {
    backgroundColor: tokens.color.danger,
  },
  secondaryButton: {
    backgroundColor: tokens.color.card,
    borderWidth: 1,
    borderColor: tokens.color.border,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  secondaryText: {
    color: tokens.color.ink,
    fontWeight: "700",
  },
});
