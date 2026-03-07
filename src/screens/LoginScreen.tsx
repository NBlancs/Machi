import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { MachiButton } from "../components/ui/MachiButton";
import { MachiLogo } from "../components/ui/MachiLogo";
import { MachiTextField } from "../components/ui/MachiTextField";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

export function LoginScreen({ onRegister }: { onRegister: () => void }) {
  const { login } = useAppState();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await login(loginValue.trim(), password);
    if (!success) {
      Alert.alert("Login failed", "Check your email or username and password.");
    }
  };

  return (
    <AppBackground>
      <View style={styles.root}>
        <View style={styles.logoWrap}>
          <MachiLogo />
        </View>
        <MachiTextField label="Email / Username" value={loginValue} onChangeText={setLoginValue} style={styles.field} />
        <MachiTextField label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.field} />
        <Pressable style={styles.linkWrap}>
          <Text style={styles.link}>Forgot Password?</Text>
        </Pressable>
        <MachiButton label="Login" onPress={() => void handleLogin()} style={styles.button} />
        <Text style={styles.or}>OR</Text>
        <MachiButton label="Register" onPress={onRegister} style={styles.button} />
        <Text style={styles.watermark}>All rights reserved Machi™ 2026</Text>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 78,
    paddingBottom: 22,
    alignItems: "center",
  },
  logoWrap: {
    marginTop: 30,
    marginBottom: 34,
  },
  field: {
    width: "100%",
    marginTop: 22,
  },
  linkWrap: {
    marginTop: 12,
  },
  link: {
    fontFamily: tokens.font.display,
    fontSize: 12,
    color: tokens.color.secondary,
    textDecorationLine: "underline",
  },
  button: {
    width: 175,
    marginTop: 22,
  },
  or: {
    marginTop: 18,
    fontFamily: tokens.font.bodyBold,
    fontSize: 24,
    color: tokens.color.primaryDark,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  watermark: {
    marginTop: "auto",
    fontFamily: tokens.font.body,
    fontSize: 12,
    color: "rgba(0,0,0,0.45)",
  },
});
