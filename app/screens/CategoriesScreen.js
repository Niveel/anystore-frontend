import React, {useState, useMemo, useEffect, useRef} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';

import Screen from '../components/Screen';
import CustomHeader from '../components/CustomHeader';
import AppText from '../components/AppText';
import { useTheme } from '../utils/ThemeContext';
import { categories, products } from '../dummyData';
import ProductCard from '../components/ProductCard';
import ItemEmpty from '../components/ItemEmpty';

const ITEM_WIDTH = 30; 
const ITEM_PADDING = 28;

const {width} = Dimensions.get('window');

const CategoriesScreen = ({route}) => {
    const {category} = route.params;
    const {theme} = useTheme();
    const [selectedCategory, setSelectedCategory] = useState(category || categories[0]);
    const flatListRef = useRef(null);

    // memoized selected category index
    const selectedCategoryIndex = useMemo(() => {
        return categories.findIndex(cat => cat.id === selectedCategory.id);
    }, [selectedCategory]);

    // Scroll to the selected category on mount
    useEffect(() => {
        if (flatListRef.current && selectedCategoryIndex !== -1) {
            flatListRef.current.scrollToIndex({
                index: selectedCategoryIndex,
                animated: true,
                viewPosition: 0.5, 
            });
        }
    }, [selectedCategoryIndex]);

    // layout estimation for the FlatList
    const getItemLayout = (data, index) => ({
        length: ITEM_WIDTH + ITEM_PADDING,
        offset: (ITEM_WIDTH + ITEM_PADDING) * index,
        index,
    });

    // Handle scroll failures 
    const onScrollToIndexFailed = (info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                // viewPosition: 0.5,
            });
        });
    };

     // Memoize filtered products based on selected category
     const filteredProducts = useMemo(() => {
        return products.filter(product => product.category === selectedCategory.name);
    }, [selectedCategory]);

    const selectTab = (category) => {
        setSelectedCategory(category);
    }

  return (
    <Screen>
        <CustomHeader title="Categories" showIcons />
        {/* categories bar */}
        <View style={styles.tabBar}>
            <FlatList 
                ref={flatListRef}
                data={categories}
                keyExtractor={item => item.id.toString()}
                horizontal
                contentContainerStyle={styles.containerStyle}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                getItemLayout={getItemLayout} 
                onScrollToIndexFailed={onScrollToIndexFailed} 
                renderItem={({item}) => (
                    <TouchableOpacity 
                        style={[styles.tab, {
                            backgroundColor: selectedCategory.id === item.id ? theme?.misty : theme?.midnight,
                            borderTopRightRadius: item.id === categories[categories.length - 1].id ? 40 : 0,
                            borderBottomRightRadius: item.id === categories[categories.length - 1].id ? 40 : 0,
                            borderLeftWidth: item.id === categories[0].id ? 1 : 0,
                            borderRightWidth: item.id === categories[categories.length - 1].id ? 1 : 0,
                        }]}
                        activeOpacity={0.98}
                        onPress={() => selectTab(item)}
                    >
                        <AppText 
                            style={{fontSize: 10, textAlign: "center"}} 
                            numberOfLines={1}
                            color={selectedCategory.id === item.id ? theme?.white : theme?.misty}
                        >{item.name}</AppText>
                    </TouchableOpacity>
                )}
            />
        </View>
        {/* end of categories bar */}
        {/* main body */}
        <View style={styles.mainBody}>
            {filteredProducts.length > 0 ? 
                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id.toString()}
                    numColumns={width > 250 ? 2 : 1}
                    contentContainerStyle={{
                        paddingVertical: 20, 
                        paddingLeft: 5
                    }}
                    renderItem={({item}) => (
                        <ProductCard 
                            name={item.title}
                            price={item.price}
                            image={item.images}
                            companyName={item.shop_name}
                            desc={item.description}
                            item={item}
                            rating={item.rating}
                            addToCartVisible
                            onPress={() => console.log("Product pressed")}
                        />
                    )}
                /> : <ItemEmpty 
                        text="No products found in this category"
                        icon="close-circle-outline"
                        subText="Please check back later"
                    />}
        </View>
        {/* end of main body */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
  mainBody: {
      flex: 12,
  },
  tabBar: {
      flex: 1,
  },
  tab: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: "80%",
    alignSelf: 'center',
    marginLeft: -20,
    zIndex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
    containerStyle: {
        paddingLeft: 24, 
        borderRadius: 40, 
        overflow: 'hidden',
        paddingRight: 6,
    }
});

export default CategoriesScreen;