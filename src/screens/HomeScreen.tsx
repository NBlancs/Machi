import React, { useMemo } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { cityBackground, getBuildingSprite } from "../assets/assetMap";
import { AppBackground } from "../components/ui/AppBackground";
import { MachiButton } from "../components/ui/MachiButton";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { buildings, sessions, settings } = useAppState();

  const todayFocusMinutes = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return sessions
      .filter((session) => session.endedAt.slice(0, 10) === todayKey)
      .reduce((sum, session) => sum + session.focusMinutes, 0);
  }, [sessions]);

  const spotlightBuilding = buildings[buildings.length - 1];

  return (
    <AppBackground>
      <View style={styles.root}>
        {/* Title Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>MACHI</Text>
        </View>

        {/* Daily Progress message */}
        <Text style={styles.message}>
          You have focused{"\n"}
          <Text style={styles.messageBold}>for {todayFocusMinutes} mins today</Text>
        </Text>

        {/* Orbit Ring and City Planet */}
        <View style={styles.planetWrap}>
          <View style={styles.ringOuter} />
          <View style={styles.ringDotTop} />
          <View style={styles.ringDotRight} />
          <ImageBackground
            source={cityBackground}
            style={styles.citySphere}
            imageStyle={styles.citySphereImage}
          >
            {spotlightBuilding ? (
              <Image
                source={getBuildingSprite(spotlightBuilding.type, spotlightBuilding.variantIndex)}
                resizeMode="contain"
                style={styles.spotlightBuilding}
              />
            ) : null}
          </ImageBackground>
        </View>

        {/* Mayor Tag */}
        <View style={styles.tagPill}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>{settings.mayorName || "Mayor"}</Text>
        </View>

        {/* Default timer configuration preview */}
        <Text style={styles.timerValue}>
          {String(settings.focusMinutes).padStart(2, "0")}:00
        </Text>

        {/* Action button */}
        <MachiButton
          label="START FOCUS"
          onPress={() => navigation.navigate("Focus")}
          style={styles.startButton}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: tokens.font.display,
    fontSize: 32,
    color: tokens.color.primaryDark,
    fontWeight: "700",
    letterSpacing: 8,
    textAlign: "center",
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    fontFamily: tokens.font.display,
    fontSize: 18,
    lineHeight: 28,
    color: "#749BC2",
  },
  messageBold: {
    fontFamily: tokens.font.bodyBold,
    fontWeight: "700",
    color: tokens.color.primaryDark,
  },
  planetWrap: {
    width: 280,
    height: 280,
    marginVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 3,
    borderColor: "rgba(116,155,194,0.45)",
  },
  ringDotTop: {
    position: "absolute",
    top: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.color.primary,
  },
  ringDotRight: {
    position: "absolute",
    right: -6,
    top: 134,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: tokens.color.secondary,
  },
  citySphere: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFE4FF",
    shadowColor: "#000000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  citySphereImage: {
    opacity: 0.92,
  },
  spotlightBuilding: {
    width: 120,
    height: 150,
    marginTop: 22,
  },
  tagPill: {
    minHeight: 32,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: tokens.color.shadow,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.color.success,
    marginRight: 8,
  },
  tagText: {
    fontFamily: tokens.font.body,
    fontSize: 15,
    fontWeight: "600",
    color: "#203040",
  },
  timerValue: {
    fontFamily: tokens.font.bodyBold,
    fontSize: 48,
    fontWeight: "900",
    letterSpacing: 8,
    color: tokens.color.primaryDark,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  startButton: {
    width: "80%",
    maxWidth: 260,
  },
});
