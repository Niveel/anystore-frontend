import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

import { useTheme } from '../../utils/ThemeContext';

const {height} = Dimensions.get('window');

const ItemLoader = ({visible=true}) => {
    if( !visible ) return null;
    const { theme } = useTheme();
    
    // Create refs for the animated values
    const circle1 = useRef(new Animated.Value(0)).current;
    const circle2 = useRef(new Animated.Value(0)).current;
    const circle3 = useRef(new Animated.Value(0)).current;

    // start the bouncing animation
    const startAnimation = (animatedValue, delay) => {
        animatedValue.setValue(0);
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animatedValue, {
                    toValue: -50, // Move up by 50 pixels
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0, // Move back to the original position
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            {
                iterations: -1,
            }
        ).start();
    };

    useEffect(() => {
        startAnimation(circle1);
        startAnimation(circle2, 250);
        startAnimation(circle3, 500);
    }, [circle1, circle2, circle3]);

    return (
        <View 
            style={[styles.container, { 
                    backgroundColor: theme?.midnight, }
            ]}
            accessible={true}
            accessibilityLabel="Loading"
            accessibilityLiveRegion='assertive'
        >
            <Animated.View style={[styles.circle, { backgroundColor: theme.horizon, transform: [{ translateY: circle1 }] }]} />
            <Animated.View style={[styles.circle, { backgroundColor: theme.misty, transform: [{ translateY: circle2 }], marginLeft: 50 }]} />
            <Animated.View style={[styles.circle, { backgroundColor: theme.amberGlow, transform: [{ translateY: circle3 }], marginLeft: 100 }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: "100%",
    },
    circle: {
        position: 'absolute',
        borderRadius: 50,
        width: 100,
        height: 100,
    }
});

export default ItemLoader;
