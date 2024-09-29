import { View, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms'
import routes from '../navigation/routes'
import Screen from '../components/Screen'
import usersApi from '../api/users'
import { useTheme } from '../utils/ThemeContext'
import AppButton from '../components/AppButton'

const validationSchema = Yup.object().shape({
    username: Yup.string().required("Enter your name").label("Username").min(3, "Name too short").max(40, "Name too long"),
    email: Yup.string().required("Please enter your email address").email().label("Email"),
    password: Yup.string().required("You need to create a password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Must contain at least one uppercase, one lowercase, one number and one symbol"),
    confirmPassword: Yup.string().required("Confirm your password").label("Confirm Password").oneOf([Yup.ref('password')], 'Passwords must match')
})

const SignUpScreen = ({ navigation }) => {
    const [error, setError] = useState()
    const [isSecure, setIsSecure] = useState(true)
    const [isConfirmSecure, setIsConfirmSecure] = useState(true)
    const [loading, setLoading] = useState(false)
    
    const { theme } = useTheme()

    const handleSubmit = (userInfo) => {
        usersApi.register(userInfo).then(response => {

            if(response.status === 201){
                console.log("User registered: ", response.data.message)
                navigation.navigate("SignupVerify", { userInfo })
            } else {
                setError(response.data.message)
                console.log("error registering user: ", response.data.message)
            }

        }).catch(error => {
            setError(error.message)
            console.log("error registering user: ", error.message)

        }).finally(() => {
            setLoading(false)
        })

    }

    return (
        <Screen style={{ backgroundColor: theme?.midnight }}>
            {/* bottom circles */}
            <View style={[styles.bottomCircle, {
                    backgroundColor: theme?.horizon,
                    bottom: -20,
                    left: 0,
                }]}
            />
            <View style={[styles.bottomCircle, {
                    backgroundColor: theme?.horizon,
                    bottom: 20,
                    left: -40,
                }]}
            />
            <View style={[styles.bottomCircle, {
                    backgroundColor: theme?.horizon,
                    bottom: -20,
                    right: 0,
                }]}
            />
            <View style={[styles.bottomCircle, {
                    backgroundColor: theme?.horizon,
                    bottom: 20,
                    right: -40,
                }]}
            />
            {/* end of bottom circles */}
            <ScrollView 
                style={{
                    minHeight: "100%",
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: -20,
                }}
            >
                <View style={styles.headerContainer}>
                    <Text style={[styles.subHeading, {color: theme?.misty,}]}>Create account</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={[styles.backBtn, {backgroundColor: theme?.horizon,}]}
                        accessible={true}
                        accessibilityLabel="Go Back"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={30} color={theme?.punch} />
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.signUpContainer}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : null}
                            enabled
                            style={{ 
                                flex: 1, 
                                alignItems: "center" 
                            }}
                        >
                            <ActivityIndicator animating={loading} size="large" />
                            <AppForm
                                initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                                onSubmit={handleSubmit}
                                validationSchema={validationSchema}
                            >
                                <ErrorMessage error={error} visible={error} />

                                <AppFormField
                                    name="username"
                                    icon="account"
                                    placeholder="Violet Jones"
                                    placeholderTextColor={theme?.mistyLight}
                                    label="Username"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    color={theme?.misty}
                                />
                                <AppFormField
                                    name="email"
                                    icon="email"
                                    placeholder="jonpa@niklo.pt"
                                    placeholderTextColor={theme?.mistyLight}
                                    keyboardType="email-address"
                                    label="email"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    color={theme?.misty}
                                />
                                <AppFormField
                                    name="password"
                                    icon={isSecure ? "eye" : "eye-off"}
                                    placeholder="*******"
                                    placeholderTextColor={theme?.mistyLight}
                                    label="password"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={isSecure}
                                    textContentType="password"
                                    onPress={text => setIsSecure(!isSecure)}
                                    visibilityLabel={isSecure ? "show password" : "hide password"}
                                    color={theme?.misty}
                                />
                                <AppFormField
                                    name="confirmPassword"
                                    icon={isConfirmSecure ? "eye" : "eye-off"}
                                    placeholder="*******"
                                    placeholderTextColor={theme?.mistyLight}
                                    label="confirm password"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={isConfirmSecure}
                                    onPress={() => setIsConfirmSecure(!isConfirmSecure)}
                                    textContentType="password"
                                    visibilityLabel={isConfirmSecure ? "show password" : "hide password"}
                                    color={theme?.misty}
                                />
                                <SubmitButton 
                                    color={theme?.horizon} 
                                    title="Sign up" 
                                    width="60%" 
                                    height={45}
                                    disabled={loading}
                                    textColor={theme?.white}
                                />
                            </AppForm>
                        </KeyboardAvoidingView>
                        <View style={styles.loginBox}>
                            <Text style={{ color: theme?.misty, alignSelf: "center", marginBottom: 10 }}>Already have an account?
                            </Text>
                            <AppButton
                                title="Login"
                                onPress={() => navigation.navigate(routes.LOGIN)}
                                color={theme?.midnight}
                                style={{
                                    width: "50%",
                                    height: 45,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderColor: theme?.horizon,
                                }}
                                textColor={theme?.horizon}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </Screen>
    )
}

const styles = StyleSheet.create({
    backBtn: {
        padding: 5,
        borderRadius: 20,
        position: "absolute",
        top: 10,
        left: 10,
    },
    headerContainer: {
        width: '100%',
        height: "10%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 25,
        fontWeight: '900',
        marginTop: 5,
    },
    loginBox: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
        flex: 3,
    },
    login: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    signUpContainer: {
        width: '100%',
        height: "90%",
        padding: 5,
        marginTop: 50,
        overflow: "hidden",
    },
    subHeading: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        padding: 0,
        textTransform: "capitalize",
    },
    bottomCircle: {
        width: 80,
        height: 80,
        opacity: 0.5,
        position: "absolute",
        borderRadius: 45,
    }
})

export default SignUpScreen