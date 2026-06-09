import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { AppHeader } from "../components/ui/AppHeader";
import { MachiButton } from "../components/ui/MachiButton";
import { SectionCard } from "../components/ui/SectionCard";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

export function SettingsScreen() {
  const { settings, updateSettings, resetData } = useAppState();
  const [focusMinutes, setFocusMinutes] = useState(String(settings.focusMinutes));
  const [breakMinutes, setBreakMinutes] = useState(String(settings.breakMinutes));
  const [cityColumns, setCityColumns] = useState(String(settings.cityColumns));
  const [mayorName, setMayorName] = useState(settings.mayorName || "Mayor");

  useEffect(() => {
    setFocusMinutes(String(settings.focusMinutes));
    setBreakMinutes(String(settings.breakMinutes));
    setCityColumns(String(settings.cityColumns));
    setMayorName(settings.mayorName || "Mayor");
  }, [settings.breakMinutes, settings.cityColumns, settings.focusMinutes, settings.mayorName]);

  const handleSave = async () => {
    await updateSettings({
      focusMinutes: Math.max(5, Number(focusMinutes) || settings.focusMinutes),
      breakMinutes: Math.max(1, Number(breakMinutes) || settings.breakMinutes),
      cityColumns: Math.max(3, Math.min(8, Number(cityColumns) || settings.cityColumns)),
      mayorName: mayorName.trim() || "Mayor",
    });

    Alert.alert("Saved", "Your Machi settings were updated.");
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
        <AppHeader title="SETTINGS" subtitle="Adjust local defaults and mayor configuration." />

        <SectionCard style={styles.card}>
          <Text style={styles.label}>Mayor Name</Text>
          <TextInput
            style={styles.input}
            value={mayorName}
            onChangeText={setMayorName}
            maxLength={18}
            placeholder="Enter Mayor name"
          />

          <Text style={styles.label}>Default Focus Minutes</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={focusMinutes}
            onChangeText={setFocusMinutes}
          />

          <Text style={styles.label}>Default Break Minutes</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={breakMinutes}
            onChangeText={setBreakMinutes}
          />

          <Text style={styles.label}>City Columns (3 - 8)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={cityColumns}
            onChangeText={setCityColumns}
          />
        </SectionCard>

        <MachiButton label="SAVE" onPress={() => void handleSave()} style={styles.primaryCta} />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.dangerButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleReset}
        >
          <Text style={styles.primaryText}>Reset Local Data</Text>
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
  input: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: tokens.space.md,
    backgroundColor: "#F8FCFF",
    color: tokens.color.ink,
    fontFamily: tokens.font.body,
    fontSize: 16,
  },
  button: {
    marginTop: tokens.space.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  primaryCta: {
    width: 175,
    alignSelf: "center",
    marginTop: 24,
  },
  dangerButton: {
    backgroundColor: tokens.color.danger,
    marginTop: 36,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
