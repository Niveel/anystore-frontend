import React from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import TitleBar from './TitleBar';
import { categories } from '../dummyData';
import routes from '../navigation/routes';

const {width} = Dimensions.get('window');

const CategoryList = (props) => {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const CategoryComponent = ({item}) => (
        <TouchableOpacity 
            style={[styles.category, {
            backgroundColor: theme?.white,
            borderColor: theme?.misty,
            
            }]}
            onPress={() => navigation.navigate(routes.CATEGORIES_SCREEN, {category: item})}
        >
            <Image source={item.image} style={{width: 40, height: 40, borderRadius: 8}} />
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
            numColumns={width > 300 ? 4 : 3}
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