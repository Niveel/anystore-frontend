import React, {useState, useEffect} from 'react'
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native'
import {useNavigation} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import CartItem from './cart/CartItem'
import SearchInput from './SearchInput'
import routes from '../navigation/routes'
import ItemEmpty from './ItemEmpty'
import SearchNotFound from './SearchNotFound'
import AppText from './AppText'
import { useTheme } from '../utils/ThemeContext'

function RadarList(props) {
  const [radarData, setRadarData] = useState([])
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [resultNotFound, setResultNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  const {theme} = useTheme()

  const fetchRadarItems = async () => {
    try {
      // get items from AsyncStorage
      const radarItems = await AsyncStorage.getItem('radarItems')

      if (radarItems) {
        // if there are items in the radar, parse and set them
        const parsedRadarItems = JSON.parse(radarItems)
        setRadarData(parsedRadarItems)
      }
      
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchRadarItems()
  }, [])

  if (loading) {
    // Display a loading indicator while data is being fetched
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000)
  }

  const handleDelete = item => {
    const newRadarData = radarData.filter(i => i.id !== item.id)
    setRadarData(newRadarData) 
    AsyncStorage.setItem('radarItems', JSON.stringify(newRadarData))
  }

  const websiteNameRegex = (name) => {
    if (!name) {
      return ""
    }
    
    return name.replace(/www.|.com/g, '');
  };

  const handleSearch = text => {
    setSearchQuery(text)

    if (!text.trim()) {
      setSearchQuery("")
      setResultNotFound(false)
      fetchRadarItems()
      return
    }

    const filteredItems = radarData.filter(item => item?.title.toLowerCase().includes(text.toLowerCase()) || item?.shop_name.toLowerCase().includes(text.toLowerCase()) || item?.description.toLowerCase().includes(text.toLowerCase()))

    if (filteredItems.length > 0) {
      setRadarData([...filteredItems])
      setResultNotFound(false)
    } else {
      setResultNotFound(true)
    }
  }

  const handleRadarItemPress = item => {
    navigation.navigate(routes.RADAR_PRICE_CHECK, {price: item.price})
  }
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={[styles.heading, {backgroundColor: theme?.misty}]}>
        <AppText style={[styles.text, {
          fontSize: radarData.length > 0 ? 12 : 20,
          }]} color={theme?.white} >Track your products to get notified of price changes.</AppText>
      </View>
      {radarData.length > 0 && <View style={[styles.headBox, {backgroundColor: theme?.light,}]}>
        <SearchInput 
          placeholder="Search Product" 
          placeholderTextColor={theme?.misty} 
          value={searchQuery}
          onChangeText={handleSearch}
          inputStyle={{paddingHorizontal: 10}}
        />
      </View>}
      {radarData.length === 0 && <ItemEmpty 
          icon="eye-remove" 
          text="No items in your radar" 
          subText="Add items to your radar to see them here. If you added items and they are not showing, pull down to refresh." 
        />}
        
      {resultNotFound === true ? <SearchNotFound /> : 
      <FlatList 
          data={radarData}
          keyExtractor={(item, index) => item.id ? item.id.toString() : generateRandomId().toString()}  
          renderItem={({item})=> <CartItem 
                                      companyName={item?.shop_name}
                                      desc={item?.description}
                                      image={item?.images || ["https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1713139200&semt=ais"]}
                                      name={item?.title}
                                      onPress={()=> handleRadarItemPress(item)}
                                      rating={item?.rating}
                                      price={item?.price}
                                      delPress={() => handleDelete(item)}
                                  />}
          refreshing={loading}
          onRefresh={() => {
            setLoading(true);
            fetchRadarItems();
          }}
          contentContainerStyle={{paddingHorizontal: 10}}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  headBox: {
    width: "100%",
    padding: 10,
    gap: 5,
    marginBottom: 15,
    borderRadius: 5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  heading: {
    paddingTop: 10,
  }
})
export default RadarList;