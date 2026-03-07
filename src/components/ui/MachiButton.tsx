import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { tokens } from "../../theme/tokens";

export function MachiButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    backgroundColor: tokens.color.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: tokens.color.shadow,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: tokens.font.display,
    fontSize: 22,
    color: tokens.color.primaryDark,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
