import React, { useRef, } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';
import Icon from '../components/Icon';

const { width } = Dimensions.get('window');

const ImagesScreen = ({ route, navigation }) => {
  const { images, currentImage } = route.params
  const { theme } = useTheme();
  const flatListRef = useRef(null);

  const initialIndex = images.findIndex((image) => image.url === currentImage);

    // Zoom gesture handling
    const scale = new Animated.Value(1);
    const onZoomEvent = Animated.event([{ nativeEvent: { scale: scale } }], {
      useNativeDriver: true,
    });
  
    const onZoomStateChange = (event) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    };

  const renderItem = ({ item }) => (
    <PinchGestureHandler
      onGestureEvent={onZoomEvent}
      onHandlerStateChange={onZoomStateChange}
    >
      <Animated.View style={{ 
          transform: [{ scale }], 
        }}
      >
        <Image
          source={{ uri: item.url }}
          style={styles.image}
        />
      </Animated.View>
    </PinchGestureHandler>
  )

  return (
    <Screen>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityLabel="Close"
          accessibilityHint="Close images screen"
        >
          <Icon
            name="close"
            size={30}
            backgroundColor={theme?.horizon}
            color={theme?.white}
            style={{ borderRadius: 20, padding: 5 }}
          />
        </TouchableOpacity>
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          ref={flatListRef}
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: "center",
            paddingVertical: 10,
            backgroundColor: theme?.black,
          }}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(data, index) => ({
            length: width,     
            offset: width * index, 
            index
          })}
          // when scrolling index fails
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: "100%",
    resizeMode: "contain"
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  }
});

export default ImagesScreen;
