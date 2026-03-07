import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { MachiLogo } from "../components/ui/MachiLogo";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timeout = setTimeout(onDone, 1200);
    return () => clearTimeout(timeout);
  }, [onDone]);

  return (
    <AppBackground>
      <View style={styles.root}>
        <MachiLogo compact />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
