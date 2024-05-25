import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppButton from '../components/AppButton';
import { ErrorMessage } from '../components/forms';
import usersApi from '../api/users';
import authApi from '../api/auth';
import useAuth from '../auth/useAuth';
import AppText from '../components/AppText';

function SignupVerifyScreen({ route }) {
  const [codes, setCodes] = useState(['', '', '', '']);
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = route.params.userInfo;
  const auth = useAuth();
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
    <Screen style={styles.screen}>
      <ActivityIndicator animating={loading} size="large" color={colors.amberGlow} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <ErrorMessage error={error} visible={hasError} />
          <View>
            <AppText style={{color: colors.amberGlow, marginVertical: 20}}>Enter the 4-digit code sent to your email {userInfo.email}</AppText>
            <View style={styles.codeContainer}>
              {codes.map((code, index) => (
                <TextInput
                  key={index}
                  ref={codeInputs[index]}
                  style={styles.codeInput}
                  maxLength={1}
                  value={code}
                  onChangeText={value => handleCodeChange(index, value)}
                />
              ))}
            </View>
            <AppButton
              title="Submit Code"
              color={colors.amberGlowLight}
              width='100'
              onPress={handleSignup}
            />
          </View>
        </>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.midnight,
  },
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
    borderColor: colors.white,
    textAlign: 'center',
    color: colors.white,
  },
});

export default SignupVerifyScreen;
