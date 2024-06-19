import React, {useState} from 'react';
import { View, StyleSheet,ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import passwordResetApi from '../api/passwordReset'
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import { useTheme } from '../utils/ThemeContext';

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter a valid email").email().label("Email"), 
})

function ForgotPasswordScreen({navigation}) {
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  const handleEmailReset = async ({ email }) => {
    try {
      setLoading(true);
      const result = await passwordResetApi.generateResetCode(email);
      if (!result?.ok) {
        const errorMsg = result?.data?.message
        setError(errorMsg || "An unexpected error occurred");
        setHasError(true);
        return;
      }
      navigation.navigate('PasswordResetVerify', {email});
    }
    catch (error) {
      console.error('Error generating reset code:', error);
      alert("An unexpected error occurred");
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={[styles.screen, {backgroundColor: theme?.midnight,}]}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <ActivityIndicator animating={loading} size="large" color={theme?.amberGlow} />
          <View style={[styles.box, {backgroundColor: theme?.midnight, borderColor: theme?.amberGlow,}]}>
            <AppForm
                  initialValues={{email: ""}}
                  onSubmit={handleEmailReset}
                  validationSchema={validationSchema}
              >
                <ErrorMessage error={error} visible={hasError} />
                <AppFormField
                    name="email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="email"
                    keyboardType="email-address"
                    placeholder="Enter your email"
                    placeholderTextColor={theme?.misty}
                    textContentType="emailAddress"
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
    padding: 20,
  },
  screen: {
    paddingTop: 0,
  },
  sendLink: {
    alignSelf: "center",
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
