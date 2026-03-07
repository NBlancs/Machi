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
  const { buildings, currentUser, sessions, settings } = useAppState();

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
        <View style={styles.headerRow}>
          <Text style={styles.title}>MACHI</Text>
          <Text style={styles.menuIcon}>≡</Text>
        </View>

        <Text style={styles.message}>
          You have focused{"\n"}
          <Text style={styles.messageBold}>for {todayFocusMinutes || settings.focusMinutes} mins today</Text>
        </Text>

        <View style={styles.planetWrap}>
          <View style={styles.ringOuter} />
          <View style={styles.ringDotTop} />
          <View style={styles.ringDotRight} />
          <ImageBackground source={cityBackground} style={styles.citySphere} imageStyle={styles.citySphereImage}>
            {spotlightBuilding ? (
              <Image
                source={getBuildingSprite(spotlightBuilding.type, spotlightBuilding.variantIndex)}
                resizeMode="contain"
                style={styles.spotlightBuilding}
              />
            ) : null}
          </ImageBackground>
        </View>

        <View style={styles.tagPill}>
          <View style={styles.tagDot} />
          <Text style={styles.tagText}>{currentUser?.username || "Planning"}</Text>
        </View>

        <Text style={styles.timerValue}>{String(settings.focusMinutes).padStart(2, "0")}:00</Text>
        <MachiButton label="START" onPress={() => navigation.navigate("Focus")} style={styles.startButton} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 48,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: tokens.font.display,
    fontSize: 32,
    color: tokens.color.primaryDark,
    fontWeight: "700",
    letterSpacing: 8,
  },
  menuIcon: {
    color: tokens.color.primaryDark,
    fontSize: 36,
    lineHeight: 36,
  },
  message: {
    marginTop: 82,
    textAlign: "center",
    fontFamily: tokens.font.display,
    fontSize: 18,
    lineHeight: 30,
    color: "#749BC2",
  },
  messageBold: {
    fontFamily: tokens.font.bodyBold,
    fontWeight: "700",
  },
  planetWrap: {
    width: 300,
    height: 300,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 4,
    color: tokens.color.primaryDark,
    borderColor: "rgba(116,155,194,0.65)",
  },
  ringDotTop: {
    position: "absolute",
    top: -3,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: tokens.color.secondary,
  },
  ringDotRight: {
    position: "absolute",
    right: -7,
    top: 144,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: tokens.color.secondary,
  },
  citySphere: {
    width: 238,
    height: 238,
    borderRadius: 119,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BFE4FF",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  citySphereImage: {
    opacity: 0.92,
  },
  spotlightBuilding: {
    width: 132,
    height: 172,
    marginTop: 26,
  },
  tagPill: {
    marginTop: 20,
    minHeight: 30,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.65)",
    borderWidth: 1,
    borderColor: tokens.color.shadow,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
  timerValue: {
    marginTop: 18,
    fontFamily: tokens.font.bodyBold,
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: 10,
    color: tokens.color.primaryDark,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  startButton: {
    width: 200,
    marginTop: 12,
  },
});
