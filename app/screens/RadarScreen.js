import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import colors from '../config/colors';
import Screen from '../components/Screen';
import AppText from '../components/AppText';
import RadarList from '../components/RadarList';

function RadarScreen(props) {

  return (
    <Screen style={styles.screen}>
        <View style={styles.container}>
          <RadarList />
        </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {},
    header: {
      marginVertical: 10,
      backgroundColor: colors.horizon,
      padding: 10,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    screen: {
        backgroundColor: colors.midnight,
        padding: 10,
    },
});

export default RadarScreen;
