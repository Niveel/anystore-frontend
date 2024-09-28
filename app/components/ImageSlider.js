import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Animated } from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';

// Default test images array
const testImages = [
  { id: 1, url: "https://img.freepik.com/free-psd/red-sports-sneakers-running-shoes-transparent-background_84443-2018.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1727222400&semt=ais_hybrid" },
  { id: 2, url: "https://e7.pngegg.com/pngimages/382/622/png-clipart-sneakers-skate-shoe-nike-one-nike-shoe-purple-fashion.png" },
  { id: 3, url: "https://w7.pngwing.com/pngs/624/596/png-transparent-nike-free-nike-air-max-sneakers-shoe-red-shoes-thumbnail.png" },
  { id: 4, url: "https://png.pngtree.com/png-vector/20240407/ourmid/pngtree-nike-air-max-97-sneaker-in-silver-png-image_12266447.png" },
  { id: 5, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXy88SWy3C8-nbZY41r80vHJjgqJ52edCEyg&s" },
  { id: 6, url: "https://image.similarpng.com/very-thumbnail/2020/09/Red-Nike-shoes-premium-vector-PNG.png" },
];

const ImageSlider = ({ imagesData }) => {
  const { theme } = useTheme();

  const [selectedImage, setSelectedImage] = useState(null);
  const [indexOfImage, setIndexOfImage] = useState(0);
  const [finalImages, setFinalImages] = useState([]);

  // Function to handle image selection
  const handleImageSelect = (imageUrl) => {
    setSelectedImage(imageUrl);
    const index = finalImages.findIndex((image) => image.url === imageUrl);
    setIndexOfImage(index);
  };

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

  // Load imagesData first if available, otherwise use testImages
  useEffect(() => {
    if (imagesData.length > 0) {
      setFinalImages(imagesData);
      setSelectedImage(imagesData[0]?.url);
    } else {
      setFinalImages(testImages);
      setSelectedImage(testImages[0]?.url);
    }
  }, [imagesData]);

  return (
    <View style={styles.container}>
      {/* Scrollable list of small images (thumbnails) */}
      <FlatList
        data={finalImages}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.thumbnailList, { backgroundColor: theme?.misty }]}
        bounces={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleImageSelect(item.url)}
            accessible={true}
            accessibilityLabel="Thumbnail"
            accessibilityHint="Tap to view larger image"
          >
            <Image
              source={{ uri: item.url }}
              style={[
                styles.thumbnail,
                {
                  borderColor: selectedImage === item.url && theme?.amberGlow,
                  borderWidth: selectedImage === item.url ? 4 : 0,
                },
              ]}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />

      {/* Large image display */}
      <View
        style={styles.largeImageContainer}
        accessible={true}
        accessibilityLabel="Large Image of the selected image"
      >
        <View style={[styles.page, { backgroundColor: theme?.white }]}>
          <AppText style={[styles.pageText]}>{Number(indexOfImage) + 1} / {finalImages.length}</AppText>
        </View>
        <PinchGestureHandler
          onGestureEvent={onZoomEvent}
          onHandlerStateChange={onZoomStateChange}
        >
          <Animated.Image
            source={{ uri: selectedImage }}
            style={[styles.largeImage, {
              transform: [{ scale: scale }],
            }]}
            resizeMode="contain"
          />
        </PinchGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 8,
  },
  largeImageContainer: {
    flex: 18, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  largeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  thumbnailList: {
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    paddingLeft: 10,
    marginTop: 5,
    minWidth: '100%',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  page: {
    position: 'absolute',
    bottom: 5,
    left: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 2,
    zIndex: 2,
  },
  pageText: {
    fontSize: 14,
  },
});

export default ImageSlider;
