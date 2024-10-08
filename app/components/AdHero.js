import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';

import AdCarousel from './AdCarousel';
import CategoryList from './CategoryList';
import Trending from './Trending';

const AdHero = (props) => {

  const sections = [
    { id: 'adCarousel', component: <AdCarousel /> },
    { id: 'categoryList', component: <CategoryList /> },
    { id: 'trending', component: <Trending /> },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <FlatList
          data={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <View>{item.component}</View>}
          contentContainerStyle={{paddingBottom: 60}}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 1,
    paddingHorizontal: 2,
  }
});

export default AdHero;
