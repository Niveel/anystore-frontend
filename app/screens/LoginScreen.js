import { View, StyleSheet, Image, Text, Keyboard } from 'react-native'
import { TouchableOpacity } from 'react-native'
import React, { useState, } from 'react'
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'

import Screen from '../components/Screen'
import routes from '../navigation/routes'
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms'
import authApi from '../api/auth'
import useAuth from '../auth/useAuth'
import { useTheme } from '../utils/ThemeContext'
import colors from '../config/colors'

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required("Please insert password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Must contain at least one uppercase, one lowercase, one number and one symbol"),
})

const LoginScreen = () => {
    const { logIn } = useAuth()
    const [loginFailed, setLoginFailed] = useState(false)
    const [isSecure, setIsSecure] = useState(true)
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()

    const { theme } = useTheme()

    const handleSubmit = async ({ email, password }) => {
        Keyboard.dismiss()
        setLoading(true)
        const result = await authApi.login(email?.trim(), password)
        setLoading(false)

        if (!result.ok) return setLoginFailed(true)
        setLoginFailed(false)
        const token = result.data.token
        logIn(token)
    }

    return (
        <Screen style={{backgroundColor: theme?.midnight,}}>
            <View style={styles.headerContainer}>
                <Image source={require("../assets/login.png")} style={styles.image} blurRadius={1.5} />
                <Text style={[styles.heading, {color: theme?.white,}]}>Shopwit</Text>
                <Text style={[styles.subHeading, {color: theme?.white,}]}>Your one stop app for your shopping needs.</Text>
            </View>
            <View style={[styles.loginContainer, {backgroundColor: theme?.horizon,}]}>
                <ActivityIndicator animating={loading} size="large" />
                <AppForm
                    initialValues={{ email: "", password: "" }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <ErrorMessage error="Invalid email or password" visible={loginFailed} />
                    <AppFormField
                        name="email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address" textContentType="emailAddress"
                        icon="email"
                        placeholder="Email"
                        placeholderTextColor={theme?.amberGlow}
                        label="email"
                    />
                    <AppFormField
                        name="password"
                        placeholder="Password"
                        placeholderTextColor={theme?.amberGlow}
                        icon={isSecure ? "eye" : "eye-off"}
                        label="password"
                        autoCapitalize="none"
                        secureTextEntry={isSecure}
                        autoCorrect={false}
                        textContentType="password"
                        onPress={() => setIsSecure(!isSecure)}
                    />
                    <SubmitButton title="Login" width="90%" />
                </AppForm>
                <View style={styles.actionWrapper}>
                    <View style={{ alignItems: "center", gap: 5 }}>
                        <Text style={{ color: theme?.white, alignSelf: "center", marginTop: 10 }}>Don't have an account?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate(routes.REGISTER)} style={[styles.signup, {backgroundColor: theme?.midnight,}]}>
                            <Text style={[styles.text, {color: theme?.text}]}> Sign up</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center", gap: 5 }}>
                        <Text style={{ color: theme?.white, alignSelf: "center", marginTop: 10 }}>Forgot password?
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate(routes.FORGOT_PASSWORD)} style={[styles.reset, {backgroundColor: theme?.misty,}]}>
                            <Text style={[styles.text, { color: theme?.midnight, fontWeight: "bold" }]}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 40,
        fontWeight: "900",
        marginTop: 20,
    },
    subHeading: {
        fontSize: 14,
        marginTop: 10,
        textAlign: "center",
    },
    headerContainer: {
        width: "100%",
        height: "30%",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: 100,
        width: 140,
        borderRadius: 10,
        alignSelf: "center",
    },
    loginContainer: {
        width: "100%",
        height: "70%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        padding: 0,
        textTransform: "capitalize",
    },
    actionWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        padding: 10,
        height: 150,
        gap: 30,
    }
    ,
    signup: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    reset: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    }

})

export default LoginScreen