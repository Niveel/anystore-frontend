import React, {useState} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import passwordReset from '../api/passwordReset';
import { useTheme } from '../utils/ThemeContext';

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Please enter a new password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Must contain at least one uppercase, one lowercase, one number and one symbol"),
  confirmPassword: Yup.string().required("Confirm your password").label("Confirm Password").oneOf([Yup.ref('password')], 'Passwords must match')
})

function NewPasswordScreen({navigation, route}) {
  const [isSecure, setIsSecure] = useState(true)
  const [isConfirmSecure, setIsConfirmSecure] = useState(true)
  const [error, setError] = useState('')
  const [hasError, setHasError] = useState(false)

  const email = route.params.email;
  const { theme } = useTheme();

  const sendToLogin = async ({password}) => {
    try {
      const response = await passwordReset.resetPassword(email, password);
      if (!response.ok) {
        setError(response?.data?.message || "An unexpected error occurred");
        setHasError(true);
        return;
      }

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  }

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={[styles.box, {
            backgroundColor: theme?.midnight,
            borderColor: theme?.amberGlow,
          }]}>
            <AppForm
                  initialValues={{password: "", confirmPassword: ""}}
                  onSubmit={sendToLogin}
                  validationSchema={validationSchema}
              >
                <ErrorMessage error={error} visible={hasError} />
                <AppFormField
                    name="password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon={isSecure ? "lock" : "lock-open"}
                    placeholder="Enter new password"
                    placeholderTextColor={theme?.misty}
                    textContentType="emailAddress"
                    secureTextEntry={isSecure}
                    onPress={() => setIsSecure(!isSecure)}
                />
                <AppFormField
                    name="confirmPassword"
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon={isConfirmSecure ? "lock" : "lock-open"}
                    placeholder="Confirm new password"
                    placeholderTextColor={theme?.misty}
                    textContentType="emailAddress"
                    secureTextEntry={isConfirmSecure}
                    onPress={() => setIsConfirmSecure(!isConfirmSecure)}
                />
                <SubmitButton 
                    title="Submit" 
                    width="90%"
                    color={theme?.amberGlow}
                    textColor={theme?.midnight}
                />
            </AppForm>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    gap: 20,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    width: "100%",
    height: 400,
  },
  container: {
    height: "100%",
    width: "100%",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  screen: {
    paddingTop: 0,
  },
  sendLink: {
    alignSelf: "center",
    marginTop: 10,
  },
});

export default NewPasswordScreen;