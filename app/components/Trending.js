import React from 'react';
import { View, StyleSheet, FlatList, Dimensions} from 'react-native';

import TitleBar from './TitleBar';
import ProductCard from './ProductCard';
import {products} from '../dummyData'

const { width } = Dimensions.get("window");

const Trending = (props) => {

  const priceRegex = (price) => {
    return price.replace(/\$/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <View style={styles.container}>
      <TitleBar title="Trending" />

      <FlatList
        data={products}
        keyExtractor={(product) => product.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            name={item.title}
            desc={item.desc}
            price={priceRegex(item.price)}
            companyName={item.companyName}
            image={item.images}
            rating={item.rating}
            addToCartVisible
            item={item}
          />
        )}
        numColumns={width > 300 ? 3: 2}
        contentContainerStyle={{
          padding: 5, 
          justifyContent: 'center',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {}
});

export default Trending;
