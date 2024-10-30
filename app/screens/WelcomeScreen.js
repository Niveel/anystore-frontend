import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Platform, Dimensions } from 'react-native'
import React from 'react'

import AppButton from '../components/AppButton'
import routes from '../navigation/routes'
import { useTheme } from '../utils/ThemeContext'
import bg from '../assets/onboard_bg.jpeg'
import { TouchableOpacity } from 'react-native'
import Icon from '../components/Icon'

const {width} = Dimensions.get("window")
const isIos = Platform.OS === "ios"

const isBigScreen = width > 300 

const WelcomeScreen = ({ navigation }) => {
    const { theme } = useTheme()

    return (
        < ImageBackground style={styles.background} source={bg} blurRadius={1}>
            <SafeAreaView>
                {/* back button */}
                <TouchableOpacity
                    onPress={() =>{
                        navigation.navigate(routes.HOME)
                        }}
                    style={[styles.backBtn, {backgroundColor: theme?.horizon}]}
                >
                    <Icon name="arrow-left" size={35} color={theme?.white} />
                </TouchableOpacity>
                <View style={styles.wrapper}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.header, {color: theme?.midnight,}]}>Shopwit</Text>
                        <Text style={[styles.bigText, {
                            color: theme?.white,
                        }]}>Discover and shop </Text>
                        <Text style={[styles.bigText, {
                            color: theme?.white,
                        }]}>for your needs!</Text>
                        <Text style={[styles.smallText, {color: theme?.white}]}>Shopwit is an e-commerce search engine that makes it easy for users to search products across thousands of e-commerce websites, track price changes and collaborate with friends and family using Crit, a messaging feature.</Text>
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
            </SafeAreaView>
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
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bigText: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: -8,
    },
    wrapper: {
        width: "100%",
        padding: 10,
        height: '55%',
        paddingBottom: 20,
    },
    smallText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 10,
    },
    backBtn: {
        position: 'absolute',
        top: isIos && isBigScreen ? 20 : 10,
        left: 10,
        padding: 5,
        borderRadius: 50,
        zIndex: 1,
        elevation: 2,
    }
})
export default WelcomeScreen