import React from 'react';
import { View,} from 'react-native';

import Screen from '../components/Screen';
import RadarList from '../components/RadarList';
import { useTheme } from '../utils/ThemeContext';

function RadarScreen(props) {
  const { theme } = useTheme();

  return (
    <Screen style={{
      backgroundColor: theme?.midnight,
      padding: 10,
    }}>
        <View>
          <RadarList />
        </View>
    </Screen>
  );
}

export default RadarScreen;
