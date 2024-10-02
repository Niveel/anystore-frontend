import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../utils/ThemeContext';

const CircleLoader = ({ size = 40, color, style }) => {
  const { theme } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation
    const spinAnimation = () => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };
    spinAnimation();
  }, [spinValue]);

  // Interpolation for rotating animation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.loader,
        {
          width: size,
          height: size,
        //   borderColor: color || theme.horizon,
          borderTopColor: theme?.misty,
          borderWidth: size * 0.2,
          borderRadius: size / 2,
          transform: [{ rotate: spin }],
          borderLeftColor: color || theme.horizon,
          borderBottomColor: color || theme.horizon,
          borderRightColor: color || theme.horizon,
        },
        style, 
      ]}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    borderTopColor: 'transparent',
  },
});

export default CircleLoader;
