import { View, StyleSheet, Image, Text, Keyboard, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native'
import React, { useState, } from 'react'
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import Screen from '../components/Screen'
import routes from '../navigation/routes'
import { AppForm, AppFormField, SubmitButton, ErrorMessage } from '../components/forms'
import authApi from '../api/auth'
import useAuth from '../auth/useAuth'
import { useTheme } from '../utils/ThemeContext'
import AppButton from '../components/AppButton'

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required("Please insert password").min(8).label("Password").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "Must contain at least one uppercase, one lowercase, one number and one symbol"),
})

const { width } = Dimensions.get("window")

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
        try {
            const result = await authApi.login(email?.trim().toLowerCase(), password)
            setLoading(false)
    
            if (!result.ok) return setLoginFailed(true)
            setLoginFailed(false)
            const token = result.data.token
            logIn(token)
            navigation.navigate("App", { screen: 'Product' })
        } catch (error) {
            setLoading(false)
            console.log("error logging in: ", error)
        }
    }

    return (
        <Screen>
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
            {/* end of bottom circles */}
            <ScrollView
                style={{
                    minHeight: "100%",
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                    gap: 0,
                }}
            >
                <View style={styles.headerContainer}>
                    <Text style={[styles.subHeading, {color: theme?.black,}]}>Welcome back</Text>
                    <Image source={require("../assets/login.png")} style={styles.image} />
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        style={[styles.backBtn, {backgroundColor: theme?.horizon,}]}
                        accessible={true}
                        accessibilityLabel="Go Back"
                    >
                        <MaterialCommunityIcons name="arrow-left" size={30} color={theme?.white} />
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginContainer}>
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
                                keyboardType="email-address" 
                                textContentType="emailAddress"
                                icon="email"
                                placeholder="po@gitnu.id"
                                placeholderTextColor={theme?.mistyLight}
                                label="email"
                                style={{ color: theme?.misty }}
                                color={theme?.misty}
                            />
                            <AppFormField
                                name="password"
                                placeholder="*******"
                                placeholderTextColor={theme?.mistyLight}
                                icon={isSecure ? "eye" : "eye-off"}
                                label="password"
                                autoCapitalize="none"
                                secureTextEntry={isSecure}
                                autoCorrect={false}
                                textContentType="password"
                                onPress={() => setIsSecure(!isSecure)}
                                visibilityLabel={isSecure ? "show password" : "hide password"}
                                color={theme?.misty}
                            />
                            <SubmitButton 
                                title="Login" 
                                width="50%" 
                                disabled={loading}
                                color={theme?.horizon}
                                height={45}
                                textColor={theme?.white}
                            />
                        </AppForm>
                        <View style={styles.actionWrapper}>
                            <View style={styles.otherCta}>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate(routes.FORGOT_PASSWORD)}
                                >
                                    <Text style={[styles.forgot, {color: theme?.punch}]}>Forgot password?</Text>
                                </TouchableOpacity>
                                <Text style={{ color: theme?.horizon, alignSelf: "center", marginTop: 5, fontWeight: "bold" }}>Don't have an account?
                                </Text>
                                <AppButton
                                    title="Sign up"
                                    onPress={() => navigation.navigate(routes.REGISTER)}
                                    color={theme?.midnight}
                                    style={{
                                        width: "50%",
                                        height: 45,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10,
                                        borderColor: theme?.horizon,
                                    }}
                                    textColor={theme?.horizon}
                                />
                            </View>
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
    heading: {
        fontSize: 25,
        fontWeight: "900",
        marginTop: 10,
    },
    subHeading: {
        fontSize: 18,
        marginTop: 5,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    headerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: width / 1.6,
        width: width / 1.5,
        borderRadius: 10,
        alignSelf: "center",
    },
    loginContainer: {
        flex: 1.2,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        padding: 0,
        textTransform: "capitalize",
    },
    actionWrapper: {
        height: 200,
    }
    ,
    signup: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    otherCta: {
        width: "100%",
        height: "100%",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    forgot: {
        textDecorationColor: "blue",
        textDecorationLine: "underline",
    },
    bottomCircle: {
        width: 80,
        height: 80,
        opacity: 0.5,
        position: "absolute",
        borderRadius: 45,
    }


})

export default LoginScreen