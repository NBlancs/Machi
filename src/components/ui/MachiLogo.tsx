import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { appLogo, appWordmark } from "../../assets/assetMap";

export function MachiLogo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.wrapper, compact && styles.compactWrapper]}>
      <Image source={appLogo} resizeMode="contain" style={[styles.logo, compact && styles.compactLogo]} />
      <Image source={appWordmark} resizeMode="contain" style={[styles.wordmark, compact && styles.compactWordmark]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  compactWrapper: {
    transform: [{ scale: 0.75 }],
  },
  logo: {
    width: 192,
    height: 246,
  },
  compactLogo: {
    width: 150,
    height: 180,
  },
  wordmark: {
    width: 150,
    height: 42,
    marginTop: -10,
  },
  compactWordmark: {
    width: 126,
    height: 36,
  },
});
