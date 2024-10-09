import React, {useState, useEffect, useMemo} from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform} from 'react-native';

import TitleBar from './TitleBar';
import ProductCard from './ProductCard';
import trendingProducts from '../api/trendingProducts';

const { width, height } = Dimensions.get("window");

const Trending = (props) => {
  const [products, setProducts] = useState([]);
  const isLargeIos = Platform.OS === 'ios' && width > 300;

  const priceRegex = (price) => {
    return price.replace(/\$/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await trendingProducts.getTrendingProducts();

        if (response.ok) {
          setProducts(response.data);
        }

      } catch (error) {
        console.log("Error fetching trending products", error);
        if (error.response) {
          console.log("Error getting trending products", error.response.data);
        } else {
          console.log("Error getting trending products", error.message);
        }
      }
    };

    fetchTrendingProducts();

    const interval = setInterval(() => {
      fetchTrendingProducts();
    }, 300000);

    return () => {
      setProducts([])
      clearInterval(interval);
    };
  }, []);

  // slice the first 9 products
  const slicedProducts = useMemo(() => products.slice(0, 20), [products]);

  return (
    <View style={styles.container}>
      <TitleBar title="Trending" />

      <FlatList
        data={slicedProducts}
        keyExtractor={(product) => product.title.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={width > 300 ? 3: 2}
        renderItem={({ item }) => (
          <ProductCard
            name={item.title}
            desc={item.desc}
            price={priceRegex(item.price)}
            companyName={item.shop_name}
            image={item.images}
            rating={item.rating}
            addToCartVisible
            item={item}
            width={isLargeIos ? 120 : 115}
            height={height / 4.5}
          />
        )}
        contentContainerStyle={{
          padding: 5, 
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Trending;
