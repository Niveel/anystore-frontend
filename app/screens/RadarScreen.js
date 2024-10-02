import React from 'react';
import { View,} from 'react-native';

import Screen from '../components/Screen';
import RadarList from '../components/RadarList';
import { useTheme } from '../utils/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import CritTabLoader from '../components/loaders/CritTabLoader';

function RadarScreen(props) {
  const { theme } = useTheme();

  return (
    <Screen style={{
      backgroundColor: theme?.midnight,
      paddingTop: 0,
    }}>
        <CustomHeader title="Radar" showIcons />
        <View style={{paddingBottom: 15,paddingTop: 15, flex: 1,}}>
            <RadarList/> 
        </View>
    </Screen>
  );
}

export default RadarScreen;
