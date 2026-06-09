import React, { useRef } from "react";
import { PanResponder, StyleSheet, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "../../theme/tokens";

interface CircularSliderProps {
  value: number; // in minutes
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  children?: React.ReactNode;
}

export function CircularSlider({
  value,
  onChange,
  min = 0,
  max = 120,
  step = 1,
  size = 240,
  children,
}: CircularSliderProps) {
  const radius = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;

  // Track coordinates and calculate angle
  const handlePanResponderUpdate = (locationX: number, locationY: number) => {
    const dx = locationX - cx;
    const dy = locationY - cy;

    // Angle in radians from 3 o'clock (standard polar coordinate 0)
    let angle = Math.atan2(dy, dx);

    // Shift angle so 0 is at 12 o'clock (top)
    let adjustedAngle = angle + Math.PI / 2;
    if (adjustedAngle < 0) {
      adjustedAngle += 2 * Math.PI;
    }

    // Convert angle to value in range [min, max]
    const ratio = adjustedAngle / (2 * Math.PI);
    const rawVal = min + ratio * (max - min);

    // Apply step
    let steppedVal = Math.round(rawVal / step) * step;

    // Clamp value
    let clampedVal = Math.max(min, Math.min(max, steppedVal));

    // Prevent sudden wrap-around jumps (e.g. 0 min <-> 120 min)
    const deltaThreshold = (max - min) * 0.75;
    if (Math.abs(clampedVal - value) > deltaThreshold) {
      // If the jump is too big, ignore or snap to boundary based on proximity
      if (value < min + (max - min) * 0.2) {
        clampedVal = min;
      } else {
        clampedVal = max;
      }
    }

    onChange(clampedVal);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        handlePanResponderUpdate(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
      onPanResponderMove: (evt) => {
        handlePanResponderUpdate(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
      },
    })
  ).current;

  // Calculate current angle and handle coordinates for rendering
  const progressRatio = (value - min) / (max - min);
  const currentAngle = -Math.PI / 2 + progressRatio * 2 * Math.PI;

  const handleX = cx + radius * Math.cos(currentAngle);
  const handleY = cy + radius * Math.sin(currentAngle);

  // SVG Path for progress arc
  // M startX startY A rx ry x-axis-rotation large-arc-flag sweep-flag endX endY
  const startX = cx;
  const startY = cy - radius;
  const largeArcFlag = progressRatio > 0.5 ? 1 : 0;

  // Draw arc, handle edge case of 100% full circle
  const progressPath =
    progressRatio >= 0.999
      ? `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${startY}`
      : `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${handleX} ${handleY}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Interactive Svg ring */}
      <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill}>
        <Svg width={size} height={size}>
          {/* Background circle track */}
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke="#DCEFFC"
            strokeWidth={14}
            fill="none"
          />

          {/* Active progress arc */}
          {value > min && (
            <Path
              d={progressPath}
              stroke={tokens.color.primary}
              strokeWidth={14}
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Draggable thumb/knob */}
          <Circle
            cx={handleX}
            cy={handleY}
            r={15}
            fill="#FFFFFF"
            stroke={tokens.color.primary}
            strokeWidth={4}
          />
          {/* Tactile inner dot in knob */}
          <Circle
            cx={handleX}
            cy={handleY}
            r={5}
            fill={tokens.color.primaryDark}
          />
        </Svg>
      </View>

      {/* Embedded children (planet) centered inside the slider */}
      <View
        style={[
          styles.innerContainer,
          {
            width: radius * 2 - 10,
            height: radius * 2 - 10,
            borderRadius: radius - 5,
            top: cx - radius + 5,
            left: cy - radius + 5,
          },
        ]}
        pointerEvents="none"
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  innerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
