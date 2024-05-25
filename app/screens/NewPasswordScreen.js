import React, {useState} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import colors from '../config/colors';
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import passwordReset from '../api/passwordReset';

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
    <Screen style={styles.screen}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.box}>
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
                    placeholderTextColor={colors.misty}
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
                    placeholderTextColor={colors.misty}
                    textContentType="emailAddress"
                    secureTextEntry={isConfirmSecure}
                    onPress={() => setIsConfirmSecure(!isConfirmSecure)}
                />
                <SubmitButton 
                    title="Submit" 
                    width="90%"
                    color={colors.amberGlow}
                    textColor={colors.midnight}
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
    backgroundColor: colors.midnight,
    borderColor: colors.amberGlow,
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
    backgroundColor: colors.midnight,
    paddingTop: 0,
  },
  sendLink: {
    alignSelf: "center",
    marginTop: 10,
  },
  text: {
    color: colors.amberGlow,
    fontWeight: 'bold',
    padding: 0,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default NewPasswordScreen;