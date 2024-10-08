import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'

import Icon from './Icon' 
import AppText from './AppText'
import { useTheme } from '../utils/ThemeContext'

const ListItem = ({IconComponent, title, subtitle, onPress, Chevron, style}) => {
    const {theme} = useTheme()
  return (
    <TouchableHighlight 
        onPress={onPress} 
        underlayColor={theme?.lighter} 
        accessible={true}
        accessibilityLabel={title}
        accessibilityLiveRegion='assertive'
    >
        <View style={[styles.listWrapper, {backgroundColor: theme?.midnightLight,}]}>
            {IconComponent}
            <View style={styles.container}>
                <AppText 
                    style={{fontWeight: "bold"}} 
                    numberOfLines={1}
                    color={theme?.amberGlow}
                >{title}</AppText>
                <Text style={[{ fontWeight: "bold"}, style]}>{subtitle}</Text>
            </View>
            {Chevron && <Icon name="chevron-right" size={35} color={theme?.amberGlowLight} />}
        </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
    },
    listWrapper: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
    }
})

export default ListItem