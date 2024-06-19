import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import Screen from './Screen';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../utils/ThemeContext';

function RadarPriceCheckScreen({route, navigation}) {
  const {price} = route.params;
  const {theme} = useTheme()

  const [thePrice, setThePrice] = useState(parseFloat(price))

  const handleIncPrice = () => {
    if(thePrice < price) {
      setThePrice(thePrice + 1)
    }
  }

  const handleDecPrice = () => {
    if(thePrice > 1) {
      setThePrice(thePrice - 1)
    }
  }

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <View style={styles.container}>
        <AppText style={{fontSize: 20}}>Current Price</AppText>
        <View style={[styles.currentPrice, {backgroundColor: theme?.light,}]}>
          <AppText style={{fontSize: 25}}>${price}</AppText>
        </View>
      </View>
      <View style={[styles.setPriceContainer, {backgroundColor: theme?.light,}]}>
        <View style={styles.setPriceBox}>
          <AppText style={{fontSize: 20}}>Notify me when price drops to:</AppText>
          <View style={styles.priceDropBox}>
            <TouchableOpacity
              style={[styles.controlBtn, {backgroundColor: theme?.amberGlow,}]}
              onPress={handleDecPrice}
            >
              <MaterialCommunityIcons name="minus" size={30} color={theme?.text} />
            </TouchableOpacity>
            <View style={styles.currentPrice}>
              <AppText style={{fontSize: 25}}>${thePrice.toFixed(0)}</AppText>
            </View>
            <TouchableOpacity
              style={[styles.controlBtn, {backgroundColor: theme?.amberGlow,}]}
              onPress={handleIncPrice}
            >
              <MaterialCommunityIcons name="plus" size={30} color={theme?.text} />
            </TouchableOpacity>
          </View>
          <AppButton 
            title="Set Price" 
            onPress={() => {
              if(!thePrice) return;
              Alert.alert(
                'Price Set',
                'You will be notified when the price drops to $' + thePrice.toFixed(0),
                [
                  {text: 'OK', onPress: () => {
                    navigation.goBack()
                    navigation.navigate("Home")
                  }}
                ],
                {cancelable: false}
              )
            }}
            style={{
              marginTop: 30,
              alignSelf: 'center'
            }}
            width='50%'
          />
        </View>
      </View>
    </Screen>
  ); 
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  currentPrice: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  controlBtn: {
    padding: 10,
    borderRadius: 5
  },
  priceDropBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 20,
    paddingVertical: 10
  },
  screen: {
    paddingTop: 0,
  },
  setPriceContainer: {
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    height: "100%",
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 30,
    paddingVertical: 20
  }
});

export default RadarPriceCheckScreen;