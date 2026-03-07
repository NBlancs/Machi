import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Image, ImageBackground } from "react-native";
import { cityBackground, getBuildingSprite } from "../assets/assetMap";
import { AppBackground } from "../components/ui/AppBackground";
import { AppHeader } from "../components/ui/AppHeader";
import { MachiButton } from "../components/ui/MachiButton";
import { SectionCard } from "../components/ui/SectionCard";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function DurationControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.durationCard}>
      <Text style={styles.durationLabel}>{label}</Text>
      <View style={styles.durationRow}>
        <Pressable style={styles.adjustButton} onPress={() => onChange(Math.max(5, value - 5))}>
          <Text style={styles.adjustButtonText}>-5</Text>
        </Pressable>
        <Text style={styles.durationValue}>{value} min</Text>
        <Pressable style={styles.adjustButton} onPress={() => onChange(Math.min(90, value + 5))}>
          <Text style={styles.adjustButtonText}>+5</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function FocusTimerScreen() {
  const { settings, completeFocusSession, buildings, currentUser } = useAppState();
  const [focusMinutes, setFocusMinutes] = useState(settings.focusMinutes);
  const [breakMinutes, setBreakMinutes] = useState(settings.breakMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(settings.focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [startedAtIso, setStartedAtIso] = useState<string | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || remainingSeconds !== 0 || completedRef.current || !startedAtIso) {
      return;
    }

    completedRef.current = true;
    setIsRunning(false);

    void completeFocusSession(focusMinutes, breakMinutes, startedAtIso)
      .then(() => {
        Alert.alert("Session complete", "A new building was added to your city.");
      })
      .finally(() => {
        setStartedAtIso(null);
        completedRef.current = false;
      });
  }, [breakMinutes, completeFocusSession, focusMinutes, isRunning, remainingSeconds, startedAtIso]);

  useEffect(() => {
    if (isRunning) {
      return;
    }

    setFocusMinutes(settings.focusMinutes);
    setBreakMinutes(settings.breakMinutes);
    setRemainingSeconds(settings.focusMinutes * 60);
  }, [isRunning, settings.breakMinutes, settings.focusMinutes]);

  const progress = useMemo(() => {
    const total = focusMinutes * 60;
    return total === 0 ? 0 : remainingSeconds / total;
  }, [focusMinutes, remainingSeconds]);

  const spotlightBuilding = buildings[buildings.length - 1];

  const handleStart = () => {
    if (!startedAtIso) {
      setStartedAtIso(new Date().toISOString());
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartedAtIso(null);
    setRemainingSeconds(focusMinutes * 60);
  };

  return (
    <AppBackground>
      <View style={styles.root}>
        <AppHeader title="FOCUS" subtitle="Pomodoro defaults with editable focus and break lengths." />

        <View style={styles.heroWrap}>
          <View style={styles.planetOutline} />
          <ImageBackground source={cityBackground} style={styles.heroPlanet} imageStyle={styles.heroImage}>
            {spotlightBuilding ? (
              <Image source={getBuildingSprite(spotlightBuilding.type, spotlightBuilding.variantIndex)} resizeMode="contain" style={styles.heroBuilding} />
            ) : null}
          </ImageBackground>
        </View>

        <View style={styles.tagPill}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>{currentUser?.username || "Planning"}</Text>
        </View>

        <SectionCard style={styles.timerCard}>
          <Text style={styles.timerValue}>{formatSeconds(remainingSeconds)}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(4, progress * 100)}%` }]} />
          </View>
          <Text style={styles.caption}>Break after completion: {breakMinutes} minutes</Text>
        </SectionCard>

        <DurationControl
          label="Focus Length"
          value={focusMinutes}
          onChange={(next) => {
            setFocusMinutes(next);
            setRemainingSeconds(next * 60);
          }}
        />
        <DurationControl label="Break Length" value={breakMinutes} onChange={setBreakMinutes} />

        <View style={styles.actionsRow}>
          <MachiButton label={isRunning ? "RESTART" : "START"} onPress={handleStart} style={styles.primaryAction} />
          <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={handlePause}>
            <Text style={styles.secondaryText}>Pause</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.secondaryButton]} onPress={handleReset}>
            <Text style={styles.secondaryText}>Reset</Text>
          </Pressable>
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
    paddingBottom: 16,
  },
  heroWrap: {
    marginTop: 18,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
  },
  planetOutline: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 4,
    borderColor: "rgba(116,155,194,0.65)",
  },
  heroPlanet: {
    width: 172,
    height: 172,
    borderRadius: 86,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFE4FF",
  },
  heroImage: {
    opacity: 0.95,
  },
  heroBuilding: {
    width: 106,
    height: 136,
    marginTop: 22,
  },
  tagPill: {
    alignSelf: "center",
    minHeight: 30,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: tokens.color.shadow,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  tagDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF1B1B",
    marginRight: 8,
  },
  tagText: {
    fontFamily: tokens.font.body,
    fontSize: 15,
    color: "#121212",
  },
  timerCard: {
    alignItems: "center",
  },
  timerValue: {
    fontFamily: tokens.font.bodyBold,
    color: tokens.color.primaryDark,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 8,
  },
  progressTrack: {
    height: 12,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#DCEFFC",
    marginTop: tokens.space.md,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: tokens.color.primary,
  },
  caption: {
    marginTop: 10,
    color: "#60758A",
  },
  durationCard: {
    marginTop: tokens.space.md,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: tokens.space.md,
  },
  durationLabel: {
    color: tokens.color.primaryDark,
    fontWeight: "700",
    marginBottom: 10,
    fontFamily: tokens.font.display,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  durationValue: {
    fontFamily: tokens.font.title,
    color: tokens.color.primaryDark,
    fontSize: 18,
    fontWeight: "700",
  },
  adjustButton: {
    minWidth: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.card,
    borderColor: tokens.color.border,
    borderWidth: 1,
    paddingVertical: 10,
  },
  adjustButtonText: {
    color: tokens.color.ink,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: tokens.space.sm,
    marginTop: tokens.space.lg,
    alignItems: "center",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingVertical: 14,
  },
  primaryButton: {
    backgroundColor: tokens.color.primary,
  },
  primaryAction: {
    flex: 1.3,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
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
