import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import React from 'react'
import colors from '../config/colors'
import Icon from './Icon' 
import AppText from './AppText'

const ListItem = ({IconComponent, title, subtitle, onPress, Chevron, style}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.lighter} >
        <View style={styles.listWrapper}>
            {IconComponent}
            <View style={styles.container}>
                <AppText style={{color: colors.amberGlow, fontWeight: "bold"}} numberOfLines={1}>{title}</AppText>
                <Text style={[{color: colors.misty, fontWeight: "bold"}, style]}>{subtitle}</Text>
            </View>
            {Chevron && <Icon name="chevron-right" size={35} color={colors.amberGlowLight} />}
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
        backgroundColor: colors.midnight,
        alignItems: "center",
        backgroundColor: colors.light,
        borderRadius: 5,
    }
})

export default ListItem