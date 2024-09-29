import { FlatList, StyleSheet, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View } from 'react-native'
 
import FavoriteCard from './FavoriteCard'
import SearchInput from './SearchInput'
import SearchNotFound from './SearchNotFound'
import ItemEmpty from './ItemEmpty'
import { useTheme } from '../utils/ThemeContext'
import Screen from './Screen'
 
const FavoriteStoreList = () => {
    const [favStore, setFavStore] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [resultNotFound, setResultNotFound] = useState(false);
    const navigation = useNavigation();
    const { theme } = useTheme();
    
    useEffect(() => {
        fetchFavoriteStores();
    }, []); 
    
    const fetchFavoriteStores = async () => {
        try {
            const storedFavStores = await AsyncStorage.getItem('favStores');
            if (storedFavStores) {
                const parsedFavStores = JSON.parse(storedFavStores);
                setFavStore(parsedFavStores);
            }
        } catch (error) {
            console.error('Error fetching favorite stores:', error);
        }
    };

    const handleFavDelete = async (store) => {
        try {
            const updatedFavStores = favStore.filter(s => s !== store);
            setFavStore(updatedFavStores);
            await AsyncStorage.setItem('favStores', JSON.stringify(updatedFavStores));
        } catch (error) {
            console.error('Error removing favorite store:', error);
        }
    };

    const handleOnSearch = (text) => {
        setSearchQuery(text);

        if(!text.trim()) {
            setSearchQuery("");
            setResultNotFound(false);
            fetchFavoriteStores();
            return;
        }
        const filteredStores = favStore.filter(store => store.toLowerCase().includes(text.toLowerCase()));

        if(filteredStores.length) {
            setFavStore([...filteredStores]);
        } else {
            setResultNotFound(true);
        }
    }
    
    return (
        <Screen style={{paddingTop: 0}}>
         {favStore.length > 0 && <View style={[styles.headBox, {backgroundColor: theme?.light,}]}>
          <SearchInput 
            placeholder="Search Store" 
            placeholderTextColor={theme?.misty} 
            autoCapitalize="none"
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleOnSearch}
            inputStyle={{paddingHorizontal: 10}}
          />
         </View>}
         {favStore.length === 0 && <ItemEmpty 
                                        icon="store-off"
                                        text="Favorite store empty" 
                                        subText="You have not added any store to your favorite list."
                                    />}
            {resultNotFound ? <SearchNotFound /> : 
                <FlatList 
                    data={favStore}
                    keyExtractor={item => item.toString()}
                    contentContainerStyle={{padding: 10, gap: 10}}
                    renderItem={({item}) => (
                        <FavoriteCard 
                            shopName={item}
                            onPress={() => {
                                navigation.navigate("Store", { shopName: item })
                            }}
                            removeFavorite={() => handleFavDelete(item)}
                        />
                    )}
                    refreshing={refreshing}
                    onRefresh={() => {
                        fetchFavoriteStores();
                    }}
                />}
        </Screen>
    );
};

const styles = StyleSheet.create({
    headBox: {
        width: "100%",
        paddingBottom: 10,
        marginBottom: 10,
        gap: 5,
        borderRadius: 5
    },
})

export default FavoriteStoreList;
