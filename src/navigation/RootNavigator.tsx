import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppNavigator } from "./AppNavigator";
import { LoginScreen } from "../screens/LoginScreen";
import { RegistrationScreen } from "../screens/RegistrationScreen";
import { SplashScreen } from "../screens/SplashScreen";
import { useAppState } from "../state/AppContext";

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { currentUser } = useAppState();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      {currentUser ? (
        <AppNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login">
            {({ navigation }) => <LoginScreen onRegister={() => navigation.navigate("Register")} />}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {({ navigation }) => <RegistrationScreen onBack={() => navigation.goBack()} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
