import React, {useState} from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import Screen from '../components/Screen';
import changeEmail from '../api/changeEmail';
import storage from '../auth/storage';
import useAuth from '../auth/useAuth';
import { useTheme } from '../utils/ThemeContext';

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"), 
})

function EmailResetScreen(props) {
    const [error, setError] = useState()
    const navigation = useNavigation()
    const {user} = useAuth()
    const {theme} = useTheme();

    const handleChangeEmail = async ({ email }) => {
        try {
            // Get the authentication token
            const authToken = await storage.getToken();

            if (!authToken) {
                setError('Authentication token not found.');
                console.error('Authentication token not found.');
                return;
            }
            
            const result = await changeEmail(authToken, email);
    
            if (!result || !result.ok) {
                setError(result?.data?.message || 'An unexpected error occurred.');
                return;
            }
    
            user.email = email;
    
            Alert.alert(
                "Email Changed",
                "Your email has been changed successfully.",
                [
                    { text: "OK", onPress: () => navigation.navigate("AccountSettings") }
                ],
                { cancelable: false }
            );
    
        } catch (error) {
            console.error('Error changing email:', error);
            setError('An unexpected error occurred.'); 
        }
    };
    

  return (
    <Screen style={{backgroundColor: theme?.midnight,}}>
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
        <View style={[styles.container,]}>
            <AppForm
                initialValues={{email: ""}}
                onSubmit={handleChangeEmail}
                validationSchema={validationSchema}
            >
                {error && <ErrorMessage error={error} visible={error} />}
                <AppFormField
                    name="email"
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="email"
                    keyboardType="email-address"
                    placeholder="hizifi@gerfolmal.ao"
                    placeholderTextColor={theme?.mistyLight}
                    textContentType="emailAddress"
                    color={theme?.misty}
                    height={50}
                />
                <SubmitButton 
                    title="Change email" 
                    width="60%"
                    color={theme?.horizon}
                    textColor={theme?.white}
                />
            </AppForm>
        </View>
        </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 40,
  },
});

export default EmailResetScreen;