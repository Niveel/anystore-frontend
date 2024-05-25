import React, {useLayoutEffect} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';

import colors from '../config/colors';
import Screen from '../components/Screen';
import StoreList from '../components/StoreList';

function StoreScreen({route, navigation}) {
  const { shopName } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: shopName?.toUpperCase(), 
    });
  }, [navigation, shopName]);

  return (
    <Screen style={styles.screen}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.container}>
           <StoreList/>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
        padding: 10,
  },
  
    screen: {
        backgroundColor: colors.midnight,
        paddingTop: 0,
    }
});

export default StoreScreen;