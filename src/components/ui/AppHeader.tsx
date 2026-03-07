import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { tokens } from "../../theme/tokens";

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.menu}>≡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: tokens.font.display,
    fontSize: 28,
    color: tokens.color.primaryDark,
    letterSpacing: 6,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontFamily: tokens.font.body,
    fontSize: 13,
    color: "#6A8097",
  },
  menu: {
    color: tokens.color.primaryDark,
    fontSize: 34,
    lineHeight: 34,
  },
});
