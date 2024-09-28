import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';

function SearchNotFound(props) {
  const {theme} = useTheme()
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[StyleSheet.absoluteFillObject,styles.container]}
          accessible={true}
          accessibilityLabel="No results found"
        >
            <FontAwesome5 name="frown-open" size={85} color={theme?.amberGlow} />
            <AppText 
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 10
              }}
              color={theme?.punch}
            >No results found</AppText>
        </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    alignItems: 'center',
    zIndex: -1,
    opacity: 0.7,
  }
});

export default SearchNotFound;