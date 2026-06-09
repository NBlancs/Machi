import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Image, ImageBackground } from "react-native";
import { cityBackground, getBuildingSprite } from "../assets/assetMap";
import { AppBackground } from "../components/ui/AppBackground";
import { AppHeader } from "../components/ui/AppHeader";
import { MachiButton } from "../components/ui/MachiButton";
import { SectionCard } from "../components/ui/SectionCard";
import { CircularSlider } from "../components/ui/CircularSlider";
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

function BreakDurationControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <View style={styles.durationCard}>
      <Text style={styles.durationLabel}>Break Length</Text>
      <View style={styles.durationRow}>
        <Pressable
          style={({ pressed }) => [styles.adjustButton, pressed && styles.adjustButtonPressed]}
          onPress={() => onChange(Math.max(1, value - 1))}
        >
          <Text style={styles.adjustButtonText}>-1</Text>
        </Pressable>
        <Text style={styles.durationValue}>{value} min</Text>
        <Pressable
          style={({ pressed }) => [styles.adjustButton, pressed && styles.adjustButtonPressed]}
          onPress={() => onChange(Math.min(30, value + 1))}
        >
          <Text style={styles.adjustButtonText}>+1</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function FocusTimerScreen() {
  const { settings, completeFocusSession, buildings } = useAppState();
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

  const handleSliderChange = (newMins: number) => {
    if (!isRunning) {
      setFocusMinutes(newMins);
      setRemainingSeconds(newMins * 60);
    }
  };

  return (
    <AppBackground>
      <View style={styles.root}>
        <AppHeader title="FOCUS" subtitle="POMODORO CITY BUILDER" />

        {/* Circular Slider wrapping the city planet */}
        <View style={styles.sliderWrapper}>
          <View pointerEvents={isRunning ? "none" : "auto"}>
            <CircularSlider
              value={focusMinutes}
              onChange={handleSliderChange}
              min={0}
              max={120}
              step={1}
              size={240}
            >
              <ImageBackground
                source={cityBackground}
                style={styles.heroPlanet}
                imageStyle={styles.heroImage}
              >
                {spotlightBuilding ? (
                  <Image
                    source={getBuildingSprite(spotlightBuilding.type, spotlightBuilding.variantIndex)}
                    resizeMode="contain"
                    style={styles.heroBuilding}
                  />
                ) : null}
              </ImageBackground>
            </CircularSlider>
          </View>
        </View>

        {/* Mayor Name Tag Pill */}
        <View style={styles.tagPill}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>{settings.mayorName || "Mayor"}</Text>
        </View>

        {/* Big Countdown Timer Card */}
        <SectionCard style={styles.timerCard}>
          <Text style={styles.timerValue}>{formatSeconds(remainingSeconds)}</Text>
          <Text style={styles.caption}>
            {isRunning ? "Focusing..." : "Drag slider ring to set time"}
          </Text>
        </SectionCard>

        {/* Break Duration Setup */}
        {!isRunning && (
          <BreakDurationControl value={breakMinutes} onChange={setBreakMinutes} />
        )}

        {/* Actions Row */}
        <View style={[styles.actionsRow, isRunning && styles.actionsRowRunning]}>
          <MachiButton
            label={isRunning ? "RUNNING" : "START"}
            onPress={handleStart}
            style={styles.primaryAction}
          />
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={handlePause}
          >
            <Text style={styles.secondaryText}>Pause</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={handleReset}
          >
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
    justifyContent: "space-between",
  },
  sliderWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  heroPlanet: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFE4FF",
  },
  heroImage: {
    opacity: 0.95,
  },
  heroBuilding: {
    width: 90,
    height: 120,
    marginTop: 18,
  },
  tagPill: {
    alignSelf: "center",
    minHeight: 30,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: tokens.color.shadow,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
    paddingVertical: 18,
    marginHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
  timerValue: {
    fontFamily: tokens.font.bodyBold,
    color: tokens.color.primaryDark,
    fontSize: 54,
    fontWeight: "900",
    letterSpacing: 8,
  },
  caption: {
    marginTop: 6,
    color: "#60758A",
    fontSize: 13,
    fontFamily: tokens.font.body,
  },
  durationCard: {
    marginHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  durationLabel: {
    color: tokens.color.primaryDark,
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: tokens.font.display,
    fontSize: 14,
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
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.card,
    borderColor: tokens.color.border,
    borderWidth: 1,
    paddingVertical: 8,
  },
  adjustButtonPressed: {
    opacity: 0.6,
  },
  adjustButtonText: {
    color: tokens.color.ink,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: tokens.space.sm,
    marginTop: 12,
    marginHorizontal: 10,
    alignItems: "center",
  },
  actionsRowRunning: {
    marginTop: 40, // push down slightly if no break control shown
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    paddingVertical: 14,
  },
  actionButtonPressed: {
    opacity: 0.7,
  },
  primaryAction: {
    flex: 1.4,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  secondaryText: {
    color: tokens.color.ink,
    fontWeight: "700",
  },
});
