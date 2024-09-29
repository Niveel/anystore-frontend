import { View, StyleSheet, Alert, ScrollView} from 'react-native'
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

const AccountSettingsScreen = ({navigation}) => {
  const {user, logOut} = useAuth()
  const [imageUri, setImageUri] = useState()

  const {theme} = useTheme()

  const logoutAlert = () => {
    Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
            { text: "No" },
            { text: "Yes", onPress: () => logOut() },
        ],
        { cancelable: true }
    )
} 

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnightLight,}]}>
      <CustomHeader title='Account'/>
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
                color={theme?.white}
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
              imageUri={imageUri} 
              onChangeImage={uri => setImageUri(uri)}
              style={styles.imageInput}
            />
          </View>
        </View>
        {/* end of account details */}
        {/* List container */}
        <View style={styles.listContainer}>
          <ScrollView contentContainerStyle={{flexGrow: 1, gap: 15}}>
            <List
              icon='heart-outline'
              title="Favorite Stores" 
              onPress={() => navigation.navigate(routes.FAVORITES)}
            />
            <List
              icon='cart-outline'
              title="My Cart" 
              onPress={() => navigation.navigate(routes.CART)}
            />
            <List
              icon='bell-outline'
              title="Notifications" 
              onPress={() => navigation.navigate(routes.CART)}
            />
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
            <List
              icon='headset'
              title="Help & Support" 
              onPress={() => navigation.navigate(routes.CART)}
            />
          </ScrollView>
        </View>
        {/* end of List container */}
        <View style={styles.logout}>
          <AppButton 
            title="Log Out" 
            width='60%'
            color={theme?.horizon} 
            onPress={logoutAlert} 
            textColor={theme?.white}
            style={{marginTop:"auto", marginBottom: 30}}
          />
        </View>
      </View>
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
})

export default AccountSettingsScreen
