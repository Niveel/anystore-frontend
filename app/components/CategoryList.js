import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import TitleBar from './TitleBar';
import catImg from '../assets/catg_img.jpg';

const categories = [
    {
        id: 1,
        name: "Electronics",
        image: catImg,
    },
    {
        id: 2,
        name: "Clothing",
        image: catImg,
    },
    {
        id: 3,
        name: "Furniture",
        image: catImg,
    },
    {
        id: 4,
        name: "Books",
        image: catImg,
    },
    {
        id: 5,
        name: "Appliances",
        image: catImg,
    },
    {
        id: 6,
        name: "Automobiles",
        image: catImg,
    },
    {
        id: 7,
        name: "Services",
        image: catImg,
    },
    {
        id: 8,
        name: "Miscellaneous",
        image: catImg,
    },
]

const CategoryList = (props) => {
    const { theme } = useTheme();

    const CategoryComponent = ({item}) => (
        <TouchableOpacity 
            style={[styles.category, {
            backgroundColor: theme?.white,
            borderColor: theme?.misty,
            
            }]}
            onPress={() => console.log(item.name)}
        >
            <Image source={item.image} style={{width: 40, height: 40}} />
            <AppText style={{fontSize: 8, textAlign: "center"}} numberOfLines={1}>{item.name}</AppText>
        </TouchableOpacity>
    )
  return (
    <View style={styles.container}>
        <TitleBar title="Categories" />

        <FlatList
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <CategoryComponent item={item} />}
            numColumns={4}
            contentContainerStyle={{
                padding: 5,  
                justifyContent: 'center', 
                alignItems: 'center'
            }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
    category: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        width: 80,
        height: 70,
    }
});

export default CategoryList;