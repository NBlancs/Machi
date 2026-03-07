import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppBackground } from "../components/ui/AppBackground";
import { MachiButton } from "../components/ui/MachiButton";
import { MachiLogo } from "../components/ui/MachiLogo";
import { MachiTextField } from "../components/ui/MachiTextField";
import { useAppState } from "../state/AppContext";
import { tokens } from "../theme/tokens";

export function RegistrationScreen({ onBack }: { onBack: () => void }) {
  const { register } = useAppState();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      Alert.alert("Missing info", "Fill the required registration fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Confirm password must match.");
      return;
    }

    const success = await register({ email, username, password, age, gender });
    if (!success) {
      Alert.alert("Registration failed", "That account may already exist locally.");
    }
  };

  return (
    <AppBackground>
      <View style={styles.root}>
        <Pressable style={styles.back} onPress={onBack}>
          <Text style={styles.backText}>{"<"}</Text>
        </Pressable>
        <MachiLogo compact />
        <MachiTextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.field} />
        <MachiTextField label="Username" value={username} onChangeText={setUsername} style={styles.field} />
        <MachiTextField label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.field} />
        <MachiTextField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.field} />
        <View style={styles.duoRow}>
          <MachiTextField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" style={styles.halfField} />
          <MachiTextField label="Gender" value={gender} onChangeText={setGender} style={styles.halfField} />
        </View>
        <Pressable style={styles.linkWrap} onPress={onBack}>
          <Text style={styles.link}>Already Have an Account</Text>
        </Pressable>
        <MachiButton label="Confirm" onPress={() => void handleRegister()} style={styles.button} />
        <Text style={styles.watermark}>All rights reserved Machi™ 2026</Text>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 22,
    alignItems: "center",
  },
  back: {
    width: "100%",
    marginBottom: 10,
  },
  backText: {
    fontSize: 42,
    color: tokens.color.primaryDark,
    fontWeight: "700",
  },
  field: {
    width: "100%",
    marginTop: 20,
  },
  duoRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  halfField: {
    width: "47.5%",
  },
  linkWrap: {
    marginTop: 22,
  },
  link: {
    fontFamily: tokens.font.display,
    fontSize: 12,
    color: tokens.color.secondary,
    textDecorationLine: "underline",
  },
  button: {
    width: 175,
    marginTop: 18,
  },
  watermark: {
    marginTop: "auto",
    fontFamily: tokens.font.body,
    fontSize: 12,
    color: "rgba(0,0,0,0.45)",
  },
});
