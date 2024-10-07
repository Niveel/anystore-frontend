import { View, StyleSheet, ScrollView} from 'react-native'
import React, {useState} from 'react'

// CUSTOM IMPORTS
import useAuth from '../auth/useAuth'
import Screen from '../components/Screen'
import List from '../components/List'
import AppButton from '../components/AppButton'
import ImageInput from '../components/ImageInput'
import routes from '../navigation/routes'
import { useTheme } from '../utils/ThemeContext'
import CustomHeader from '../components/CustomHeader'
import AppText from '../components/AppText'
import DescriptionModal from '../components/modals/DescriptionModal'

const AccountSettingsScreen = ({navigation}) => {
  const {user, logOut} = useAuth()
  const [imageUri, setImageUri] = useState()
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  const {theme} = useTheme()

  const handleLogout = () => {
    setLogoutModalVisible(true)
  }

  // console.log('user', user)

  const darkModeTextColor = theme?.amberGlow === "#e2521d" ? theme?.text : theme?.white

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnightLight,}]}>
      <CustomHeader title='Account' showIcons/>
      <View style={styles.itemsContainer}>
        {/* account details */}
        <View style={styles.accountDetails}>
          <View style={[styles.infoBox, {backgroundColor: theme?.horizon}]}>
            <View style={styles.detailsInnerBox}>
              <AppText 
                style={{
                  fontSize: 16,
                  textAlign: "center",
                }}
                color={darkModeTextColor}
              >{user?.username.toUpperCase()}</AppText>
              <AppText 
                style={{
                  fontSize: 14,
                  textAlign: "center",
                }}
                color={theme?.white}
              >{user?.email.toLowerCase()}</AppText>
            </View>
            <ImageInput 
              imageUri={imageUri || user?.profileImage} 
              onChangeImage={uri => setImageUri(uri)}
              style={styles.imageInput}
            />
          </View>
        </View>
        {/* end of account details */}
        {/* List container */}
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={{flexGrow: 1, gap: 15}}>
            {/* <List
              icon='bell-outline'
              title="Notifications" 
              onPress={() => navigation.navigate(routes.CART)}
            /> */}
            <List
              icon='account-tie-outline'
              title="Account Settings" 
              onPress={() => navigation.navigate(routes.ACCOUNT_DETAILS_SETTINGS)}
            />
            <List
              icon='cog-outline'
              title="Other Settings" 
              onPress={() => navigation.navigate(routes.OTHER_SETTINGS)}
            />
            {/* <List
              icon='headset'
              title="Help & Support" 
              onPress={() => navigation.navigate(routes.CART)}
            /> */}
          </ScrollView>
        </View>
        {/* end of List container */}
        <View style={styles.logout}>
          <AppButton 
            title="Log Out" 
            width='60%'
            color={theme?.horizon} 
            onPress={handleLogout} 
            textColor={darkModeTextColor}
            style={{marginTop:"auto", marginBottom: 30}}
          />
        </View>
      </View>
      {/* modal for logout */}
      <DescriptionModal
        visible={logoutModalVisible}
        header='Log Out'
        closeModal={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalInner}>
          <AppText>Are you sure you want to log out?</AppText>
          <AppButton 
            title="Yes" 
            width='40%'
            color={theme?.horizon} 
            onPress={logOut} 
            textColor={darkModeTextColor}
            style={{marginTop: 20}}
          />
        </View>
      </DescriptionModal>
    </Screen>
  )
}

const styles = StyleSheet.create({
  itemsContainer: {
    flex: 1,
    paddingBottom: 50,
  },
  accountDetails: {
    flex: 2,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  listContainer: {
    flex: 6,
    padding: 10,
  },
  logout: { 
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  infoBox: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
  },
  screen: {
    paddingTop: 0,
  },
  imageInput: {
    position: "absolute",
    top: -50,
    left: 10,
  },
  detailsInnerBox: {
    marginLeft: "auto",
    width: "95%",
  },
  modalInner: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  }
})

export default AccountSettingsScreen
