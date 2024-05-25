import { View, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { ActivityIndicator } from 'react-native'

import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms'
import colors from '../config/colors'
import routes from '../navigation/routes'
import Screen from '../components/Screen'
import usersApi from '../api/users'
import authApi from '../api/auth'
import useAuth from '../auth/useAuth';

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
    const auth = useAuth()

    const handleSubmit = (userInfo) => {
        usersApi.register(userInfo)
        navigation.navigate("SignupVerify", { userInfo })
    }

    return (
        <Screen style={{ backgroundColor: colors.midnight }}>
            <View style={styles.headerContainer}>
                <Image source={require("../assets/signup.png")} style={styles.image} blurRadius={10} />
                <Text style={styles.heading}>Shopwit</Text>
                <Text style={styles.subHeading}>Create an account</Text>
            </View>
            <View style={styles.signUpContainer}>
                <KeyboardAvoidingView
                    behavior="position"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
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
                            placeholder="Username"
                            placeholderTextColor={colors.white}
                            label="Username"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <AppFormField
                            name="email"
                            icon="email"
                            placeholder="Email"
                            placeholderTextColor={colors.white}
                            label="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="emailAddress"
                        />
                        <AppFormField
                            name="password"
                            icon={isSecure ? "eye" : "eye-off"}
                            placeholder="Password"
                            placeholderTextColor={colors.white}
                            label="password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={isSecure}
                            textContentType="password"
                            onPress={text => setIsSecure(!isSecure)}
                        />
                        <AppFormField
                            name="confirmPassword"
                            icon={isConfirmSecure ? "eye" : "eye-off"}
                            placeholder="Confirm Password"
                            placeholderTextColor={colors.white}
                            label="confirm password"
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={isConfirmSecure}
                            onPress={() => setIsConfirmSecure(!isConfirmSecure)}
                            textContentType="password"
                        />
                        <SubmitButton title="Sign up" width="90%" />
                    </AppForm>
                </KeyboardAvoidingView>
                <View style={styles.loginBox}>
                    <Text style={{ color: colors.white, alignSelf: "center", marginBottom: 10 }}>Already have an account?
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate(routes.LOGIN)} style={styles.login}>
                        <Text style={styles.text}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: "25%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 25,
        fontWeight: '900',
        color: colors.white,
        marginTop: 5,
    },
    image: {
        height: 90,
        width: 110,
        borderRadius: 10,
    },
    loginBox: {
        width: '100%',
        height: "20%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    login: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: colors.midnight,
    },
    signUpContainer: {
        width: '100%',
        height: "75%",
        backgroundColor: colors.horizon,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 10,
    },
    subHeading: {
        fontSize: 16,
        color: colors.white,
        marginTop: 10,
        textAlign: "center",
    },
    text: {
        color: colors.amberGlow,
        fontSize: 14,
        fontWeight: "bold",
        padding: 0,
        textTransform: "capitalize",
    }
})

export default SignUpScreen