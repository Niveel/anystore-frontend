import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';


const TitleBar = ({title="heading"}) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white
  return (
    <View style={[styles.container, {backgroundColor: theme?.misty}]}>
        <AppText 
            style={{fontSize: width > 300 ? 20 : 18, fontWeight: 'bold',}}
            color={darkModeTextColor}
        >{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '70%',
    minWidth: '55%',
    alignSelf: 'center',
    borderRadius: 30,
    marginVertical: 10,
  }
});

export default TitleBar;