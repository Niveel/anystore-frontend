import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';
import AppText from '../components/AppText';

const { width } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);

const ImagesScreen = ({ route }) => {
  const { images, fallbackImage } = route.params || {
    images: ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg"]
  };

  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Limiting the number of images to a maximum of 10
  const allImages = images?.slice(0, 10) || fallbackImage || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg"];

  // Shared values for zoom and pan
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startingScale = useSharedValue(1); // Keeps track of the scale before pinch

  const flatListRef = useRef(null);

  // Gesture handler for pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      startingScale.value = scale.value; // Save the current scale at the start of the pinch
    })
    .onUpdate((event) => {
      scale.value = startingScale.value * event.scale; // Adjust scale relative to starting scale
    })
    .onEnd(() => {
      if (scale.value < 1) {
        // Reset scale and position if scaled below 1
        scale.value = withSpring(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  // Function to reset zoom when swiping to a new image
  const resetZoom = () => {
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  };

  // Function to handle current visible index of FlatList
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      runOnJS(resetZoom)(); // Reset zoom when the new image comes into view
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const renderItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <GestureDetector gesture={pinchGesture}>
        <AnimatedImage
          source={{ uri: item }}
          style={[styles.image, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
      {/* Pagination indicator */}
      <View 
        style={[styles.pagination, { backgroundColor: theme?.amberGlow }]}
        accessible={true}
        accessibilityLabel={`image ${index + 1} of ${allImages.length}`}
      >
        <AppText color={theme?.midnight} style={{ fontSize: 10 }}>
          {index + 1} / {allImages.length}
        </AppText>
      </View>
    </View>
  );

  return (
    <Screen style={{ backgroundColor: theme?.midnight }}>
      <FlatList
        ref={flatListRef}
        data={allImages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    zIndex: 2,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    padding: 5,
    borderRadius: 5,
  },
});

export default ImagesScreen;
