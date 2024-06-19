import { View, StyleSheet, TouchableOpacity,  } from 'react-native'
import React from 'react'

import Screen from '../components/Screen'
import AppText from '../components/AppText'
import { useTheme } from '../utils/ThemeContext' 

const OtherSettingsScreen = () => {

  const { theme, toggleTheme } = useTheme()

  return (
    <Screen style={{
      backgroundColor: theme.midnight,
      padding: 10,
      paddingTop: 0,
    }}>
      {/* section */}
      <View style={[styles.section, {
        backgroundColor: theme.horizon,
      }]}>
        <View style={styles.box}>
          <AppText style={[
            styles.headingText,
            {
              color: theme.text,
            }
          ]}>Change Theme</AppText>
          <AppText style={{ color: theme.text }}>
            Change the app's theme base.
          </AppText>

          <View style={styles.colorWrapper}>
            <TouchableOpacity 
              style={[styles.colorBox, {backgroundColor: "#1a2f56"}]}
              onPress={() => toggleTheme('default')}
              accessible={true}
              accessibilityLabel="Default theme"
              accessibilityHint='Change to default theme'
            >
              <AppText 
                style={styles.colorText}
                color="#f4f1e4"
              >Default</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.colorBox, {backgroundColor: "#1a1a1a"}]}
              onPress={() => toggleTheme('dark')}
              accessible={true}
              accessibilityLabel="Dark theme"
              accessibilityHint='Change to dark theme'
            >
              <AppText 
                style={styles.colorText}
                color="#fff"
              >Dark</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.colorBox, {backgroundColor: "#1f4f5c"}]}
              onPress={() => toggleTheme('aquarium')}
              accessible={true}
              accessibilityLabel="Aquarium theme"
              accessibilityHint='Change to aquarium theme'
            >
              <AppText 
                style={styles.colorText}
                color="#fff"
              >Aquarium</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.colorBox, {backgroundColor: "#f0f8ff"}]}
              onPress={() => toggleTheme('light')}
              accessible={true}
              accessibilityLabel="Light theme"
              accessibilityHint='Change to light theme'
            >
              <AppText 
                style={styles.colorText}
                color="#000"
              >Light</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.colorBox, {backgroundColor: "#4C5270"}]}
              onPress={() => toggleTheme('summer')}
              accessible={true}
              accessibilityLabel="summer theme"
              accessibilityHint='Change to summer theme'
            >
              <AppText 
                style={styles.colorText}
                color="#fff"
              >Summer</AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.colorBox, {backgroundColor: "#7e121d"}]}
              onPress={() => toggleTheme('christmas')}
              accessible={true}
              accessibilityLabel="christmas theme"
              accessibilityHint='Change to christmas theme'
            >
              <AppText 
                style={styles.colorText}
                color="#fff"
              >Christmas</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* end of section */}
    </Screen>
  )
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
  },
  colorBox: {
    padding: 10,
    width: 100,
    height: 100,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 5,
  },
  colorText: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
  },
  colorWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
    padding: 10,
    marginTop: 30,
    backgroundColor: "#f4f1e4",
    borderRadius: 10,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
})

export default OtherSettingsScreen