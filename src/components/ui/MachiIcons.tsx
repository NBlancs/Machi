import React from "react";
import Svg, { Path, Rect, Circle } from "react-native-svg";

interface IconProps {
  color: string;
  size?: number;
  focused?: boolean;
}

// 1. City/Home Icon: A cute townhouse with a triangular roof, chimney, and door
export function CityIcon({ color, size = 24, focused = false }: IconProps) {
  const strokeWidth = focused ? 2.5 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Roof */}
      <Path
        d="M3 10L12 3L21 10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chimney */}
      <Path
        d="M17 5V8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Base walls */}
      <Path
        d="M5 10V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V10"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <Path
        d="M10 21V15C10 14.4477 10.4477 14 11 14H13C13.5523 14 14 14.4477 14 15V21"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Window */}
      {focused && (
        <Rect
          x="9"
          y="8"
          width="6"
          height="4"
          rx="1"
          fill={color}
          opacity={0.25}
        />
      )}
      <Rect
        x="9"
        y="8"
        width="6"
        height="4"
        rx="1"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

// 2. Focus Icon: A stopwatch/timer with buttons at the top
export function FocusIcon({ color, size = 24, focused = false }: IconProps) {
  const strokeWidth = focused ? 2.5 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Stopwatch body */}
      <Circle
        cx="12"
        cy="13"
        r="7.5"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Top button */}
      <Path
        d="M12 2V5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Top crown button */}
      <Path
        d="M9.5 2H14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Side button */}
      <Path
        d="M17.5 5.5L19.5 7.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Watch hands */}
      <Path
        d="M12 13V9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M12 13L15 13"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Inner fill when focused */}
      {focused && (
        <Circle cx="12" cy="13" r="5" fill={color} opacity={0.2} />
      )}
    </Svg>
  );
}

// 3. History Icon: A stylized scroll/list or calendar
export function HistoryIcon({ color, size = 24, focused = false }: IconProps) {
  const strokeWidth = focused ? 2.5 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Clock outline representing time/history */}
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Curved history arrow going counterclockwise */}
      <Path
        d="M12 6C8.68629 6 6 8.68629 6 12C6 13.5 6.5 15 7.5 16.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Arrow head */}
      <Path
        d="M5 14.5L7.5 17L10 14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Hands representing history log */}
      <Path
        d="M12 8V12.5L15 14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 4. Stats Icon: A progress/bar chart showing growth
export function StatsIcon({ color, size = 24, focused = false }: IconProps) {
  const strokeWidth = focused ? 2.5 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Chart boundary axes */}
      <Path
        d="M4 20H20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M4 4V20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Bar 1 */}
      <Rect
        x="6"
        y="12"
        width="3"
        height="8"
        rx="0.5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.3 : 0}
      />
      {/* Bar 2 */}
      <Rect
        x="11"
        y="8"
        width="3"
        height="12"
        rx="0.5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.3 : 0}
      />
      {/* Bar 3 */}
      <Rect
        x="16"
        y="5"
        width="3"
        height="15"
        rx="0.5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.3 : 0}
      />
      {/* Upward trend line indicator */}
      <Path
        d="M5 15L10 10L15 7L19 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
    </Svg>
  );
}

// 5. Settings Icon: A neat cogwheel
export function SettingsIcon({ color, size = 24, focused = false }: IconProps) {
  const strokeWidth = focused ? 2.5 : 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Inner gear circle */}
      <Circle
        cx="12"
        cy="12"
        r="4"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={focused ? color : "none"}
        fillOpacity={focused ? 0.2 : 0}
      />
      {/* Outer gear ring */}
      <Circle
        cx="12"
        cy="12"
        r="7.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="4 2"
      />
      {/* Gear teeth */}
      <Path
        d="M12 2V4.5M12 19.5V22M2 12H4.5M19.5 12H22M4.93 4.93L6.7 6.7M17.3 17.3L19.07 19.07M4.93 19.07L6.7 17.3M17.3 6.7L19.07 4.93"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
