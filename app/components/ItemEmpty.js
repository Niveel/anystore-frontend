import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';


function ItemEmpty({icon,subText,text}) {
  const {theme} = useTheme()
  return (
    <TouchableWithoutFeedback>
        <View style={[StyleSheet.absoluteFillObject,styles.container]}>
            <MaterialCommunityIcons name={icon} size={180} color={theme?.amberGlow} />
            <AppText style={styles.text} color={theme?.misty}>{text}</AppText>
            <AppText style={styles.subText} color={theme?.misty}>{subText}</AppText>
        </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    subText: {
        fontSize: 16,
        marginTop: 10,
    },
    text: {
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 20,
    }
});

export default ItemEmpty;