import React, {useState} from 'react';
import { View, StyleSheet,ActivityIndicator, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import passwordResetApi from '../api/passwordReset'
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import { useTheme } from '../utils/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import AppText from '../components/AppText';
import BackBtnBar from '../components/BackBtnBar';

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Please enter a valid email").email().label("Email"), 
})

const {height} = Dimensions.get("window");

function ForgotPasswordScreen({navigation}) {
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  const handlePasswordReset = async ({ email }) => {
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
      <CustomHeader title="Forgot Password" />
      <BackBtnBar />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <AppText style={styles.sendLink}>Enter your email to receive a password reset link</AppText>
          <ActivityIndicator animating={loading} size="large" color={theme?.amberGlow} />
          <View style={[styles.box, {
            backgroundColor: theme?.midnight, 
            borderColor: theme?.horizon,
          }]}>
            <AppForm
                  initialValues={{email: ""}}
                  onSubmit={handlePasswordReset}
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
                    placeholderTextColor={theme?.mistyLight}
                    textContentType="emailAddress"
                    color={theme?.misty}
                    selectionColor={theme?.horizon}
                />
                <SubmitButton 
                    title="Submit" 
                    width="50%"
                    color={theme?.horizon}
                    textColor={theme?.white}
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
    borderWidth: 2,
    padding: 5,
    width: "100%",
    height: height / 3,
  },
  container: {
    height: "100%",
    width: "100%",
    padding: 10,
  },
  screen: {
    paddingTop: 0,
  },
  sendLink: {
    alignSelf: "center",
    fontSize: 16,
    // textAlign: "center",
    // marginTop: 10,
  },
});

export default ForgotPasswordScreen;
