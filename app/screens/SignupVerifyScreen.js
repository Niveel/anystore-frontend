import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, } from 'react-native';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { ErrorMessage } from '../components/forms';
import usersApi from '../api/users';
import authApi from '../api/auth';
import useAuth from '../auth/useAuth';
import AppText from '../components/AppText';
import { useTheme } from '../utils/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import BackBtnBar from '../components/BackBtnBar';

function SignupVerifyScreen({ route, navigation }) {
  const [codes, setCodes] = useState(['', '', '', '']);
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = route.params.userInfo;
  const auth = useAuth();
  const {theme} = useTheme();

  const codeInputs = Array(4).fill(0).map((_, i) => useRef(null));

  const handleCodeChange = (index, value) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Automatically focus on the next TextInput if the current one is filled
    if (value && index < 3) {
      codeInputs[index + 1].current.focus();
    }

    // automatically focus on the previous TextInput if the backspace is pressed
    if (!value && index > 0) {
      codeInputs[index - 1].current.focus();
    }

    if (value && index === 3) {
      Keyboard.dismiss();
    }

  };
   
  const handleSignup = async () => {
    const isAllCodesFilled = codes.every(code => code !== '');
    if (isAllCodesFilled) {
      try {
        setLoading(true);
        // Verify the code first
        const verifyResult = await usersApi.verifyCode(codes.join(''),userInfo.email);

        if (!verifyResult.ok) {
          setError(verifyResult.data.message || "Code verification failed");
          setHasError(true);
          return;
        }

        // If code verification is successful, proceed with user login
        const response = await authApi.login(userInfo.email, userInfo.password);
        auth.logIn(response.data.token);
        navigation.navigate("App", { screen: 'Product' })
  
        setHasError(false);
      } catch (error) {
        setError("An unexpected error occurred.");
        setHasError(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Invalid code");
      setHasError(true);
    }
  };
  
  return (
    <Screen style={{}}>
      <CustomHeader title="Verify Email" />
      <BackBtnBar />
      {loading && <ActivityIndicator animating={loading} size="large" color={theme?.amberGlow} />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <ErrorMessage error={error} visible={hasError} />
          <View style={styles.box}>
            <AppText style={{
              fontSize: 15, 
              textAlign: "center"
            }}>Enter the 4-digit code sent to your email {userInfo.email}</AppText>
            <View style={styles.codeContainer}>
              {codes.map((code, index) => (
                <TextInput
                  key={index}
                  ref={codeInputs[index]}
                  style={[styles.codeInput, {
                    borderColor: theme?.horizon,
                    color: theme?.misty,
                  }]}
                  selectionColor={theme?.horizon}
                  maxLength={1}
                  value={code}
                  onChangeText={value => handleCodeChange(index, value)}
                />
              ))}
            </View>
            <AppButton
              title="Submit Code"
              color={theme?.horizon}
              width='60%'
              onPress={handleSignup}
              textColor={theme?.white}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    width: "100%",
    height: 150,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
  },
  box: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
  }, 
});

export default SignupVerifyScreen;
