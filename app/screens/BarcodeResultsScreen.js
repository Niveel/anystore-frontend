import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking } from 'react-native';

import Screen from '../components/Screen';
import barcodeSearch from '../api/barcodeSearch';
import ListItem from '../components/ListItem';
import ItemLoader from '../components/loaders/ItemLoader';
import Icon from '../components/Icon';
import { useTheme } from '../utils/ThemeContext';

const BarcodeResultsScreen = ({route}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const { barcode } = route.params;

    const { theme } = useTheme();

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
        {loaded && products?.length > 0 &&
        products.map(item => {
            return (
                <View style={{
                    padding: 10,
                    marginVertical: 15,
                }}>
                    <Text style={{
                        marginBottom: 20
                    }}>Click on the link to visit the product's website.</Text>
                    <TouchableOpacity 
                        style={{
                            backgroundColor: theme?.mistyLight,
                            padding: 10,
                            borderRadius: 5
                        }}
                        onPress={() => {
                            Linking.openURL(item.link);
                        }}
                    >
                        <Text>{item.link}</Text>
                    </TouchableOpacity>
                 </View>
            )
        })
            
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