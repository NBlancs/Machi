import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { tokens } from "../../theme/tokens";

export function AppBackground({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.patternLayer} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.cream,
  },
  patternLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.color.cream,
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
});
