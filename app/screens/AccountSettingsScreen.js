import { View, Text, StyleSheet, Alert} from 'react-native'
import React, {useState} from 'react'
import * as ImagePicker from 'expo-image-picker'

import useAuth from '../auth/useAuth'
import Screen from '../components/Screen'
import colors from '../config/colors'
import ListItem from '../components/ListItem' 
import Icon from '../components/Icon'
import AppButton from '../components/AppButton'
import ImageInput from '../components/ImageInput'
import routes from '../navigation/routes'
import deleteAccount from '../api/deleteAccount'
import storage from '../auth/storage'

const AccountSettingsScreen = ({navigation}) => {
  const {user, logOut} = useAuth()
  const [imageUri, setImageUri] = useState()

  const {email} = user;

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

  const performDeleteAccount = async () => {
    const authToken = await storage.getToken();

    if (!authToken) {
      console.log('Authentication token not found.');
      alert('Authentication token not found.');
      return;
    }

    if (!email) {
      console.log('User not found.');
      alert('User not found.');
      return;
    }

    const result = await deleteAccount.deleteAccount(email, authToken);
    
    if (!result.ok) {
      console.log(result.data.message);
      alert(result.data.message);
      return;
    }

    logOut();
  }

  return (
    <Screen style={styles.screen}>
      <View>
        <Text style={styles.heading}>Account Settings</Text>
      </View>
      <View style={styles.itemsContainer}>
        {/* <View style={{marginBottom: 20,}}>
          <ImageInput 
            imageUri={imageUri} 
            onChangeImage={uri => setImageUri(uri)}
          />
        </View> */}
        <View style={styles.listContainer}>
          <ListItem 
            title="Name"
            subtitle={user?.username?.toUpperCase()}
            IconComponent={<Icon name="account" size={30} color={colors.amberGlow} />}
            // onPress={()=> navigation.navigate(routes.NAME_RESET)}
          />
          <ListItem 
            title="Email"
            subtitle={user?.email}
            IconComponent={<Icon name="email" size={30} color={colors.amberGlow} />}
            // onPress={()=> navigation.navigate(routes.EMAIL_RESET)}
          />
           <ListItem 
            title="Password"
            subtitle="*********"
            IconComponent={<Icon name="email" size={30} color={colors.amberGlow} />}
            onPress={()=> navigation.navigate(routes.PASSWORD_RESET)}
          />
          <ListItem
            title="Delete account"
            subtitle="Delete your account permanently. This action cannot be undone."
            style={{color: colors.punch, backgroundColor: colors.midnight, borderRadius: 5, padding: 5,}}
            IconComponent={<Icon name="delete" size={30} color={colors.punch} />}
            onPress={()=> Alert.alert(
              "Account Termination",
              "Are you sure you want to delete your account? This action cannot be undone!",
              [
                { text: "Yes", onPress: () => performDeleteAccount() },
                  { text: "No" },
              ],
              { cancelable: true }
          )}
          />
        </View>
        <AppButton 
          title="Log Out" 
          color={colors.amberGlowLight} 
          onPress={logoutAlert} 
          style={{marginTop:"auto"}}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  itemsContainer: {
    height: "90%",
    paddingVertical: 10,
    gap : 10, 
  },
  heading: {
    color: colors.amberGlow,
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    backgroundColor: colors.horizon,
    padding: 10,
    borderRadius: 5,
  },
  listContainer: {
    marginBottom: 20,
    gap: 15,
  },
  screen: {
    backgroundColor: colors.midnight,
    padding: 10,
  }
})

export default AccountSettingsScreen
