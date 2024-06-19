import React, {useLayoutEffect} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';

import Screen from '../components/Screen';
import StoreList from '../components/StoreList';
import { useTheme } from '../utils/ThemeContext';

function StoreScreen({route, navigation}) {
  const { shopName } = route.params;
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: shopName?.toUpperCase(), 
    });
  }, [navigation, shopName]);

  return (
    <Screen style={{
      backgroundColor: theme?.midnight,
      paddingTop: 0,
    }}>
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
  
});

export default StoreScreen;