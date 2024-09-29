import { View, StyleSheet, KeyboardAvoidingView,  Alert, ActivityIndicator } from 'react-native'
import React, {useState} from 'react'
import * as Yup from 'yup'

import {AppForm, AppFormField, SubmitButton, ErrorMessage} from '../components/forms'
import Screen from '../components/Screen'
import resetPassword from '../api/changePassword'
import storage from '../auth/storage' 
import useAuth from '../auth/useAuth'
import { useTheme } from '../utils/ThemeContext'

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Enter your previous password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Must contain at least one uppercase, one lowercase, one number and one symbol"),
  newPassword1: Yup.string().required("You need to create a password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Must contain at least one uppercase, one lowercase, one number and one symbol"),
  newPassword2: Yup.string().required("Confirm your password").label("Confirm Password").oneOf([Yup.ref('newPassword1')], 'Passwords must match')
})

const PasswordResetScreen = ({navigation}) => {
  const [isOldSecure, setIsOldSecure] = useState(true)
  const [isNewSecure, setIsNewSecure] = useState(true)
  const [isNewConfirmSecure, setIsNewConfirmSecure] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const {user, logOut} = useAuth()
  const { theme } = useTheme();

  const handleChangePassword = async ({ oldPassword, newPassword1 }) => {
    setLoading(true);
    try {
      // Get the authentication token
      const authToken = await storage.getToken();

      if (!authToken) {
        setError('Authentication token not found.');
        console.error('Authentication token not found.');
        return;
      }

      const result = await resetPassword.resetPassword(authToken, oldPassword, newPassword1);

      if (!result.ok) {
        setError(result.data.message || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      if(result.ok){
        setError(null);
        setLoading(false);
        Alert.alert("Password Changed", "Your password has been successfully changed. You have to use this password to log again. You will be logged out!", [
          { text: "OK", onPress: () => logOut() }
        ],
        { cancelable: false });
      }

    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={{backgroundColor: theme?.midnight,}}>
      {loading && <ActivityIndicator 
        size="large"
        color={theme?.amberGlow} 
      />}
      <KeyboardAvoidingView>
      <View style={[styles.container, {backgroundColor: theme?.midnight,}]}>
        <AppForm 
          initialValues={{oldPassword: "", newPassword1: "", newPassword2: ""}} 
          onSubmit={handleChangePassword}
          validationSchema={validationSchema} 
        >
          {error && <ErrorMessage error={error} visible={error} />}
            <AppFormField 
                name="oldPassword"
                autoCapitalize="none" 
                autoCorrect={false}      
                textContentType="password"
                icon={isOldSecure ? "eye" : "eye-off"}
                placeholder="Enter old password" 
                placeholderTextColor={theme?.mistyLight}
                label="Old Password"
                secureTextEntry={isOldSecure} 
                onPress={() => setIsOldSecure(!isOldSecure)}
                selectionColor={theme?.horizon}
                height={50}
                color={theme?.misty}
            />
            <AppFormField 
                name="newPassword1"
                autoCapitalize="none" 
                autoCorrect={false}    
                textContentType="password"
                icon={isNewSecure ? "eye" : "eye-off"}
                placeholder="Enter new password" 
                placeholderTextColor={theme?.mistyLight}
                label="new password"
                secureTextEntry={isNewSecure}
                onPress={() => setIsNewSecure(!isNewSecure)} 
                selectionColor={theme?.horizon}
                height={50}
                color={theme?.misty}
            />
            <AppFormField 
                name="newPassword2"
                autoCapitalize="none" 
                autoCorrect={false}    
                textContentType="password"
                icon={isNewConfirmSecure ? "eye" : "eye-off"} 
                placeholder="Confirm new password" 
                placeholderTextColor={theme?.mistyLight}
                label="Confirm new password"
                secureTextEntry={isNewConfirmSecure}
                onPress={() => setIsNewConfirmSecure(!isNewConfirmSecure)} 
                selectionColor={theme?.horizon}
                height={50}
                color={theme?.misty}
            />
          <SubmitButton 
            title="Change Password" 
            width="70%"
            textColor={theme?.white} 
          />
        </AppForm>
      </View>
        </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

})

export default PasswordResetScreen