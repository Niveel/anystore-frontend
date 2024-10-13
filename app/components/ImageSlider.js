import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity, Animated, TouchableWithoutFeedback} from 'react-native';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../utils/ThemeContext';
import AppText from './AppText';
import ItemLoader from './loaders/ItemLoader';
import routes from '../navigation/routes';

const ImageSlider = ({ imagesData, isImageLoading }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

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

  // go to images screen
  const openModal = () => {
    scale.setValue(1);
    if(finalImages.length === 0) return;
    navigation.navigate(routes.PRODUCT_IMAGES, { currentImage: selectedImage, images: finalImages });
  };

  useEffect(() => {
    if (imagesData.length > 0) {
      setFinalImages(imagesData);
      setSelectedImage(imagesData[0]?.url);
    } 
  }, [imagesData]);  

  return (
    <View style={styles.container}>
      <ItemLoader visible={isImageLoading} />
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
      <TouchableWithoutFeedback onPress={openModal}>
        <View
          style={styles.largeImageContainer}
          accessible={true}
          accessibilityLabel="Large Image of the selected image"
        >
          <View style={[styles.page, { backgroundColor: theme?.white }]}>
            <AppText style={[styles.pageText]}>{finalImages.length > 0 ? Number(indexOfImage) + 1 : 0} / {finalImages.length}</AppText>
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
      </TouchableWithoutFeedback>

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
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 50,
    elevation: 2,
    zIndex: 3,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  }
});

export default ImageSlider;
