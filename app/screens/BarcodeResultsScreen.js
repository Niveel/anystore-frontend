import React, {useEffect, useState} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import Screen from '../components/Screen';
import productsApi from '../api/products';
import ProductCard from '../components/ProductCard';
import ListItem from '../components/ListItem';
import ItemLoader from '../components/loaders/ItemLoader';
import Icon from '../components/Icon';

const BarcodeResultsScreen = ({route}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const { barcode } = route.params;

    useEffect(() => {
        const fetchProduct = async () => { 
            try {
                const response = await productsApi.searchProducts(barcode);

                if (response.ok) {
                    setProducts(response.data);
                }
                
            } catch (error) {
                console.log("Error fetching product, from barcode results: ", error);
            } finally {
                setLoading(false);
                setLoaded(true);
            }
        }

        fetchProduct();
    }, []);
  return (
    <Screen style={{
        paddingBottom: 50
    }}>
        {loading && <ItemLoader visible={loading} />}
        {loaded && products.length === 0 && 
            <View style={styles.container}>
                <ListItem
                    title="No products found"
                    subtitle="Please try again"
                    IconComponent={<Icon name="alert-circle" size={50} color="red" />}
                />
            </View>}
        {loaded && products.length > 0 &&
            <FlatList
                data={products}
                keyExtractor={(product) => product.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 5, 
                    justifyContent: 'center', 
                    // alignItems: 'center',
                    paddingBottom: 40
                }}
                renderItem={({item}) => (
                    <ProductCard
                        title={item.title}
                        subTitle={item.price}
                        image={item.images}
                        item={item}
                        companyName={item.shop_name}
                        addToCartVisible
                        rating={item.rating}
                        price={item.price}
                    />
                )}
            />
        }
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    
  }
});

export default BarcodeResultsScreen;