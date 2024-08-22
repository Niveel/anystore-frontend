import React from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

import Screen from '../components/Screen';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

const ImagesScreen = ({ route }) => {
  const images = route.params || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg"];

  const { theme } = useTheme();

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </View>
  );

  return (
    <Screen style={{backgroundColor: theme?.midnight}}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {

  },
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
});

export default ImagesScreen;
