import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";
import { FocusTimerScreen } from "../screens/FocusTimerScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { tokens } from "../theme/tokens";
import { CityIcon, FocusIcon, HistoryIcon, StatsIcon, SettingsIcon } from "../components/ui/MachiIcons";

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: tokens.color.primary,
        tabBarInactiveTintColor: "#6D8297",
        tabBarLabelStyle: {
          fontFamily: tokens.font.bodyBold,
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarStyle: {
          height: 75,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: "#FAFDFF",
          borderTopColor: tokens.color.border,
          borderTopWidth: 1.5,
        },
        tabBarIcon: ({ color, focused }) => {
          const size = 24;
          switch (route.name) {
            case "City":
              return <CityIcon color={color} size={size} focused={focused} />;
            case "Focus":
              return <FocusIcon color={color} size={size} focused={focused} />;
            case "History":
              return <HistoryIcon color={color} size={size} focused={focused} />;
            case "Stats":
              return <StatsIcon color={color} size={size} focused={focused} />;
            case "Settings":
              return <SettingsIcon color={color} size={size} focused={focused} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="City" component={HomeScreen} />
      <Tab.Screen name="Focus" component={FocusTimerScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
