import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState} from 'react'

import Screen from '../components/Screen'
import AppText from '../components/AppText'
import { useTheme } from '../utils/ThemeContext' 
import AppInfoModal from '../components/modals/AppInfoModal'

const OtherSettingsScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme, toggleTheme } = useTheme()

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Screen style={{paddingTop: 0}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* section */}
        <View style={[styles.section, {backgroundColor: theme.misty}]}>
          <View style={styles.box}>
            <AppText color={theme.white} style={styles.headingText}>Change Theme</AppText>
            <AppText color={theme.midnight} style={styles.desc}>Change the app's theme base.</AppText>

            <View style={styles.colorWrapper}>
              <TouchableOpacity 
                style={[styles.colorBox, {backgroundColor: "rgb(0, 31, 62)"}]}
                onPress={() => toggleTheme('default')}
                accessible={true}
                accessibilityLabel="Default theme"
                accessibilityHint='Change to default theme'
              >
                <AppText 
                  style={styles.colorText}
                  color="#fff"
                >Default</AppText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.colorBox, {backgroundColor: "#1a2f56"}]}
                onPress={() => toggleTheme('horizon')}
                accessible={true}
                accessibilityLabel="Horizon theme"
                accessibilityHint='Change to default theme'
              >
                <AppText 
                  style={styles.colorText}
                  color="#f4f1e4"
                >Horizon</AppText>
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
        {/* section */}
        <View style={[styles.section, {
          backgroundColor: theme.misty,
        }]}>
          <AppText color={theme.white} style={styles.headingText}>App Info</AppText>
          <TouchableOpacity 
            style={[styles.button, {backgroundColor: theme?.horizon, marginTop: 10}]}
            onPress={() => setIsModalVisible(true)}
          >
            <AppText color={theme.midnight}>About</AppText>
          </TouchableOpacity>
        </View>
        {/* end of section */}
      </ScrollView>

      <AppInfoModal 
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  box: {
    padding: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  colorBox: {
    padding: 10,
    flex: 1,
    minWidth: '40%',
    height: 90,
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
    gap: 5,
    marginTop: 5,
    flexWrap: "wrap",
    padding: 5,
    marginTop: 30,
    backgroundColor: "#f4f1e4",
    borderRadius: 10,
  },
  desc: {
    fontSize: 15,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
})

export default OtherSettingsScreen