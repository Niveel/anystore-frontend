import React, {useEffect, useState} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import Screen from '../components/Screen';
import barcodeSearch from '../api/barcodeSearch';
import ListItem from '../components/ListItem';
import ItemLoader from '../components/loaders/ItemLoader';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';

const BarcodeResultsScreen = ({route}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const { barcode } = route.params; 

    useEffect(() => {
        const fetchProduct = async () => { 
            try {
                const response = await barcodeSearch.searchBarcode(barcode);

                if (response.ok) {
                    setProducts([response.data]);
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

    console.log("Products: ", products[0].title);

  return (
    <Screen style={{paddingBottom: 50}}>
        {loading && <ItemLoader visible={loading} />}
        {loaded && products?.length === 0 && 
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
                    keyExtractor={(product) => product.title}
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
                            name={item.title}
                            subTitle={item.price}
                            image={item.images}
                            item={item}
                            companyName={item.shop_name}
                            addToCartVisible
                            rating={item.rating}
                            price={"20"}
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