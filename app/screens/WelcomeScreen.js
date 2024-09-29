import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

import AppButton from '../components/AppButton'
import routes from '../navigation/routes'
import { useTheme } from '../utils/ThemeContext'
import bg from '../assets/onboard_bg.jpeg'
import AppText from '../components/AppText'

const WelcomeScreen = ({ navigation }) => {
    const { theme } = useTheme()

    return (
        < ImageBackground style={styles.background} source={bg} blurRadius={2}>
            <View style={styles.wrapper}>
                <View style={styles.headerContainer}>
                    <Text style={[styles.header, {color: theme?.amberGlow,}]}>Shopwit</Text>
                    <Text style={[styles.bigText, {
                        color: theme?.white,
                    }]}>Discover and shop </Text>
                    <Text style={[styles.bigText, {
                        color: theme?.white,
                    }]}>for your needs!</Text>
                    <Text style={[styles.smallText, {color: theme?.white}]}>Shopwit is a very good app blah blah Shopwit is a very good app blah blah</Text>
                </View>
                <View style={styles.buttonBox}>
                    <AppButton 
                        title="Login" 
                        color={theme?.horizon} 
                        onPress={() => navigation.navigate(routes.LOGIN)} 
                        width='40%'
                        style={{
                            borderTopRightRadius: 50,
                            borderBottomRightRadius: 50,
                            borderWidth: 1,
                            borderColor: theme?.misty,
                        }}
                        textColor={theme?.white}
                    />
                    <AppButton 
                        title="Register" 
                        color={theme?.misty} 
                        onPress={() => navigation.navigate(routes.REGISTER)} 
                        width='50%'
                        style={{
                            borderTopLeftRadius: 50,
                            borderBottomLeftRadius: 50,
                            borderWidth: 1,
                            borderColor: theme?.horizon,
                        }}
                        textColor={theme?.white}
                    />
                </View>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: 100,
    },
    buttonBox: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerContainer: {
        flex: 2,
    },
    header: {
        fontSize: 24,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    bigText: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: -8,
    },
    wrapper: {
        width: "100%",
        padding: 10,
        height: '45%',
        paddingBottom: 20,
    },
    smallText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 10,
    }
})
export default WelcomeScreen