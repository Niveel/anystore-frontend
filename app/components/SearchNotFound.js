import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AppText from './AppText';
import colors from '../config/colors';

function SearchNotFound(props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[StyleSheet.absoluteFillObject,styles.container]}>
            <FontAwesome5 name="frown-open" size={85} color={colors.amberGlow} />
            <AppText style={{
                fontSize: 24,
                fontWeight: "bold",
                color: colors.punch,
                marginTop: 10
            }}>No results found</AppText>
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