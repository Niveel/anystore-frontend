import React, {useState} from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import colors from '../config/colors';
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms';
import Screen from '../components/Screen';
import changeEmail from '../api/changeEmail';
import storage from '../auth/storage';
import useAuth from '../auth/useAuth';

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"), 
})

function EmailResetScreen(props) {
    const [error, setError] = useState()
    const navigation = useNavigation()
    const {user} = useAuth()

    const handleChangeEmail = async ({ email }) => {
        try {
            // Get the authentication token
            const authToken = await storage.getToken();

            if (!authToken) {
                setError('Authentication token not found.');
                console.error('Authentication token not found.');
                return;
            }
    
            // Call the changeEmail function directly (no need for changeEmail.changeEmail)
            const result = await changeEmail(authToken, email);
    
            // Check if the request was successful
            if (!result || !result.ok) {
                setError(result?.data?.message || 'An unexpected error occurred.');
                return;
            }
    
            // Assuming your user object is mutable, you can update the email directly
            user.email = email;
    
            // Navigate to the account settings screen
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
    <Screen style={styles.screen}>
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
        <View style={styles.container}>
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
                    placeholder="Enter new email"
                    placeholderTextColor={colors.misty}
                    textContentType="emailAddress"
                />
                <SubmitButton 
                    title="Change email" 
                    width="90%"
                    color={colors.amberGlow}
                    textColor={colors.midnight}
                />
            </AppForm>
        </View>
        </TouchableWithoutFeedback>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.midnight,
    alignItems: 'center',
    justifyContent: 'center',
  },
    screen: {
        backgroundColor: colors.midnight,
    },
});

export default EmailResetScreen;