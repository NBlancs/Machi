import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { tokens } from "../../theme/tokens";

export function MachiTextField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  style,
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
  style?: object;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
        placeholder=""
        placeholderTextColor={tokens.color.secondary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: 50,
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: tokens.color.shadow,
    justifyContent: "center",
    paddingHorizontal: 18,
    shadowColor: "#000000",
    shadowOpacity: 0.18,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    position: "absolute",
    left: 18,
    top: 8,
    fontFamily: tokens.font.display,
    fontSize: 12,
    color: tokens.color.secondary,
    textDecorationLine: "underline",
  },
  input: {
    paddingTop: 18,
    paddingBottom: 6,
    fontFamily: tokens.font.body,
    fontSize: 16,
    color: tokens.color.primary,
  },
});
