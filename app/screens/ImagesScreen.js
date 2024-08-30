import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';
import AppText from '../components/AppText';

const { width } = Dimensions.get('window');

const ImagesScreen = ({ route }) => {
  const { images, fallbackImage } = route.params || {
    images: ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg"]
  };

  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Limiting the number of images to a maximum of 10
  const allImages = images?.slice(0, 10) || fallbackImage || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg"];

  // Function to handle current visible index of FlatList
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
      {/* Pagination indicator */}
      <View 
        style={[styles.pagination, {backgroundColor: theme?.amberGlow}]}
        accessible={true}
        accessibilityLabel={`image ${index + 1} of ${allImages.length}`}
      >
        <AppText color={theme?.midnight}>{index + 1} / {allImages.length}</AppText>
      </View>
    </View>
  );

  return (
    <Screen style={{ backgroundColor: theme?.midnight }}>
      <FlatList
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
