import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../utils/ThemeContext';
import Icon from './Icon';

const BackBtnBar = (props) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
  return (
    <View style={[styles.bar, {
        backgroundColor: theme?.horizon,
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, {
            borderColor: theme?.white,
          }]}
          accessible={true}
          accessibilityLabel="Go Back"
        >
          <Icon name="chevron-left" size={35} color={theme?.white} />
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
    bar: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: 10,
      },
      backBtn: {
        width: 40,
        height: 40,
        borderRadius: 25,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default BackBtnBar;