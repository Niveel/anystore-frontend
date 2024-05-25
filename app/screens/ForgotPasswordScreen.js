import React, {useState} from 'react';
import { View, StyleSheet,ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Yup from 'yup';

import colors from '../config/colors';
import Screen from '../components/Screen';
import passwordResetApi from '../api/passwordReset'
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter a valid email").email().label("Email"), 
})

function ForgotPasswordScreen({navigation}) {
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <Screen style={styles.screen}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <ActivityIndicator animating={loading} size="large" color={colors.amberGlow} />
          <View style={styles.box}>
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
                    placeholderTextColor={colors.misty}
                    textContentType="emailAddress"
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
    padding: 20,
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

export default ForgotPasswordScreen;
