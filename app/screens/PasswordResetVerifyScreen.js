import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import { ErrorMessage } from '../components/forms';
import usersApi from '../api/users';
import AppText from '../components/AppText';
import { useTheme } from '../utils/ThemeContext';
import CustomHeader from '../components/CustomHeader';

function PasswordResetVerifyScreen({navigation, route}) {
    const [codes, setCodes] = useState(['', '', '', '']);
    const [error, setError] = useState("");
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(true);

    const userEmail = route.params.email;
    const { theme } = useTheme();

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
      setDisableButton(false);
    } else {
        setDisableButton(true);
    }

  };

    const handleResetPassword = async () => {
        const isAllCodesFilled = codes.every(code => code !== '');
        if(isAllCodesFilled) {
            try {
                setLoading(true);
                const response = await usersApi.verifyCode(codes.join(''), userEmail);
                if(!response.ok) {
                    setError(response.data.message || "Code verification failed");
                    setHasError(true);
                    return;
                }

                navigation.navigate('NewPassword', {email: userEmail});
            } catch (error) {
                console.error('Error verifying code:', error);
            } finally {
                setLoading(false);
            }
        }
    }

  return (
    <Screen style={[styles.screen]}>
      <CustomHeader title="Verify Code" />
      {loading && <ActivityIndicator animating={loading} size="large" color={theme?.amberGlow} />}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1}}>
          <ErrorMessage error={error} visible={hasError} />
          <View style={styles.box}>
            <AppText style={{marginVertical: 10, textAlign: "center"}}>Enter the 4-digit code sent to your email</AppText>
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
              width='60%'
              onPress={handleResetPassword}
              disabled={disableButton}
              color={disableButton ? theme?.misty : theme?.mistyLight}
              textColor={theme?.white}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: 0,
      },
      codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: "100%",
        height: 150,
        gap: 10,
      },
      codeInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
      },
      box: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
      }
});

export default PasswordResetVerifyScreen;