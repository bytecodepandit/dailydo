import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  activeThumbColor?: string;
  inactiveThumbColor?: string;
  thumbSize?: number;
  trackWidth?: number;
  trackHeight?: number;
  animationDuration?: number;
  style?: StyleProp<ViewStyle>; // For custom styling of the container
}

const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({
  value,
  onValueChange,
  activeTrackColor = '#3B82F6',
  inactiveTrackColor = '#ccc',
  activeThumbColor = 'white',
  inactiveThumbColor = 'white',
  thumbSize = 28,
  trackWidth = 55,
  trackHeight = 30,
  animationDuration = 300,
  style,
}) => {
  const [internalValue, setInternalValue] = useState<boolean>(value);
  const translateXAnim = useRef(
    new Animated.Value(value ? trackWidth - thumbSize : 0),
  ).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: internalValue ? trackWidth - 3 - thumbSize : 0,
        duration: animationDuration,
        easing: Easing.easeInOut,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: animationDuration / 2,
          easing: Easing.easeInOut,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationDuration / 2,
          easing: Easing.easeInOut,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [
    internalValue,
    value,
    animationDuration,
    scaleAnim,
    translateXAnim,
    trackWidth,
    thumbSize,
  ]);

  const handleToggle = () => {
    const newValue = !internalValue;
    setInternalValue(newValue);
    onValueChange(newValue);
  };

  const trackStyle: ViewStyle = {
    width: trackWidth,
    height: trackHeight,
    borderRadius: trackHeight / 2,
    backgroundColor: internalValue ? activeTrackColor : inactiveTrackColor,
    justifyContent: 'center',
    paddingHorizontal: (trackHeight - thumbSize) / 2,
  };

  const thumbStyle: Animated.AnimatedStyle = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2,
    backgroundColor: internalValue ? activeThumbColor : inactiveThumbColor,
    transform: [{translateX: translateXAnim}, {scale: scaleAnim}],
    elevation: 0, // Add shadow for better visual appeal (Android)
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  };

  return (
    <TouchableOpacity
      style={[styles.container, StyleSheet.flatten(style)]}
      onPress={handleToggle}
      activeOpacity={0.8}>
      <View style={trackStyle}>
        <Animated.View style={thumbStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    fontWeight: 'bold',
  },
});

export default AnimatedSwitch;
