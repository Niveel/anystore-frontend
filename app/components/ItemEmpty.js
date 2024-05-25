import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AppText from './AppText';
import colors from '../config/colors';


function ItemEmpty({icon,subText,text}) {
  return (
    <TouchableWithoutFeedback>
        <View style={[StyleSheet.absoluteFillObject,styles.container]}>
            <MaterialCommunityIcons name={icon} size={180} color={colors.amberGlow} />
            <AppText style={styles.text}>{text}</AppText>
            <AppText style={styles.subText}>{subText}</AppText>
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
        color: colors.misty,
        marginTop: 10,
    },
    text: {
        fontSize: 26,
        fontWeight: "bold",
        color: colors.misty,
        marginTop: 20,
    }
});

export default ItemEmpty;