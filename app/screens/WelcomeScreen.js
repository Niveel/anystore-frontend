import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

import AppButton from '../components/AppButton'
import routes from '../navigation/routes'
import { useTheme } from '../utils/ThemeContext'

const WelcomeScreen = ({ navigation }) => {
    const { theme } = useTheme()

    return (
        < ImageBackground style={styles.background} source={require('../assets/welcome_bg.png')} blurRadius={4}>
            <View style={styles.headerContainer}>
                <Text style={[styles.header, {color: theme?.white,}]}>Shopwit</Text>
                <Text style={[styles.text, {
                    color: theme?.white,
                    backgroundColor: theme?.blackLight,
                }]}>Discover and shop for your needs!</Text>
            </View>
            <View style={styles.buttonBox}>
                <AppButton title="Login" color={theme?.horizon} onPress={() => navigation.navigate(routes.LOGIN)} />
                <AppButton title="Register" color={theme?.amberGlow} onPress={() => navigation.navigate(routes.REGISTER)} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBox: {
        paddingHorizontal: 10,
        paddingVertical: 60,
        gap: 30,
        opacity: 1,
        backgroundColor: "rgba(127,154,189,.8)",
        width: '100%',
        borderRadius: 20,
    },
    headerContainer: {
        paddingHorizontal: 10,
        paddingVertical: 60,
        opacity: 1,
    },
    header: {
        fontSize: 50,
        textAlign: 'center',
        fontWeight: '900',
        marginBottom: 20,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
})
export default WelcomeScreen