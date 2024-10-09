import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';
import TitleBar from './TitleBar';
import routes from '../navigation/routes';
import getCategories from '../api/categories';
import ItemLoader from './loaders/ItemLoader';

const {width} = Dimensions.get('window');

const CategoryList = (props) => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const { theme } = useTheme();
    const navigation = useNavigation();
                                            //christmas theme                                                     //summer theme
    const christmasThemeTextColor = theme?.amberGlow === "#eccd41" || theme?.amberGlow === "#38f1e5" || theme?.amberGlow === "#25e69c" ? theme?.midnight : theme?.text

    const fetchCategories = async () => {
        try {
            const response = await getCategories.getCategories();

            if(response.ok) {
                setCategories(response.data)
            }
            
        } catch (error) {
            console.log("Error fetching categories", error)
            if(error.response) {
                console.log("Error getting categories", error.response.data)
            } else {
                console.log("Error getting categories", error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    const CategoryComponent = ({item}) => (
        <TouchableOpacity 
            style={[
                styles.category, {
                backgroundColor: theme?.white,
                borderColor: theme?.misty,
            }]}
            onPress={() => navigation.navigate(routes.CATEGORIES_SCREEN, {category: item})}
        >
            <Image source={{uri: item.image}} style={{width: 40, height: 40, borderRadius: 8}} />
            <AppText style={{fontSize: 8, textAlign: "center"}} color={christmasThemeTextColor} numberOfLines={1}>{item.name}</AppText>
        </TouchableOpacity>
    )
  return (
    <View style={styles.container}>
        <TitleBar title="Categories" />

        {loading && 
            <View style={styles.loadingPlaceHolder}>
                <ItemLoader />
            </View>}

        <FlatList
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => <CategoryComponent item={item} />}
            numColumns={width > 300 ? 4 : 3}
            contentContainerStyle={{
                padding: 5,  
                justifyContent: 'center', 
                alignItems: 'center',
                justifyContent: "center",
                alignItems: "center",
            }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
    category: {
        // padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        width: 80,
        height: 70,
    },
    loadingPlaceHolder: {
        width: "100%",
        height: 200,
    }
});

export default CategoryList;