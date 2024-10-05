import React, {useState, useRef} from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import Screen from './Screen';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../utils/ThemeContext';
import { formatNumber } from '../utils/utils';

function RadarPriceCheckScreen({route, navigation}) {
  const {price} = route.params;
  const {theme} = useTheme()

  const priceToNumber = (str) => {
    const cleanedString = str.replace(/\$/g, '').replace(/,/g, '');
    return parseFloat(cleanedString);
  };

  const newPrice = priceToNumber(price);

  const [thePrice, setThePrice] = useState(newPrice)

   // Refs to store intervals for both increment and decrement
  const decIntervalRef = useRef(null);
  const incIntervalRef = useRef(null);

  const handleIncPrice = () => {
    // Increment price if it's less than the maximum price
    if(thePrice < newPrice) {
      setThePrice(prevPrice => prevPrice + 1);
    }
  }

  const handleDecPrice = () => {
    if(thePrice > 1) {
      setThePrice(prevPrice => prevPrice - 1);
    }
  }

  // Start continuous decrement when holding down the minus button
  const startContinuousDecrement = () => {
    clearInterval(decIntervalRef.current);
    decIntervalRef.current = setInterval(() => {
      setThePrice((prevPrice) => (prevPrice > 1 ? prevPrice - 1 : prevPrice));
    }, 100);
  };

  // Start continuous increment when holding down the plus button
  const startContinuousIncrement = () => {
    clearInterval(incIntervalRef.current);
    incIntervalRef.current = setInterval(() => {
      setThePrice((prevPrice) => {
        if (prevPrice < newPrice) {
          return prevPrice + 1;
        } else {
          clearInterval(incIntervalRef.current);
          return prevPrice; // Stop incrementing once price is reached
        }
      });
    }, 100);
  };

  // Stop continuous decrement
  const stopContinuousDecrement = () => {
    clearInterval(decIntervalRef.current);
  };

  // Stop continuous increment
  const stopContinuousIncrement = () => {
    clearInterval(incIntervalRef.current);
  };

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <View style={styles.container}>
        <AppText style={{fontSize: 20}}>Current Price:</AppText>
        <View style={[styles.currentPrice, {backgroundColor: theme?.light,}]}>
          <AppText style={{fontSize: 25}}>{formatNumber(price)}</AppText>
        </View>
      </View>
      <View style={[styles.setPriceContainer, {backgroundColor: theme?.misty,}]}>
        <View style={styles.setPriceBox}>
          <AppText style={{fontSize: 18, textAlign: "center"}} color={theme?.white}>Notify me when price drops to:</AppText>
          <View style={styles.priceDropBox}>
            <TouchableOpacity
              style={[styles.controlBtn, {backgroundColor: theme?.amberGlow,}]}
              onPress={handleDecPrice}
              onLongPress={startContinuousDecrement}
              onPressOut={stopContinuousDecrement}
              accessible={true}
              accessibilityLabel="Decrement Price"
            >
              <MaterialCommunityIcons name="minus" size={30} color={theme?.text} />
            </TouchableOpacity>
            <View style={styles.currentPrice}>
              <AppText style={{fontSize: 25}} color={theme?.white}>${formatNumber(thePrice.toFixed(2))}</AppText>
            </View>
            <TouchableOpacity
              style={[styles.controlBtn, {backgroundColor: theme?.amberGlow,}]}
              onPress={handleIncPrice}
              onLongPress={startContinuousIncrement}
              onPressOut={stopContinuousIncrement}
              accessible={true}
              accessibilityLabel="Increment Price"
            >
              <MaterialCommunityIcons name="plus" size={30} color={theme?.text} />
            </TouchableOpacity>
          </View>
          <AppButton 
            title="Set Price" 
            textColor={theme?.white}
            onPress={() => {
              if(!thePrice) return;
              Alert.alert(
                'Price Set',
                'You will be notified when the price drops to $' + thePrice.toFixed(0),
                [
                  {text: 'OK', onPress: () => {
                    navigation.goBack()
                    // navigation.navigate("Radar")
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
    paddingVertical: 20,
  }
});

export default RadarPriceCheckScreen;