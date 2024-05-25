import { TouchacbleOpacity, StyleSheet } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppText from './AppText'
import colors from '../config/colors'

const PickerItem = ({color=colors.misty, icon, iconColor=colors.horizon,item, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pickerItem, {backgroundColor: color}, style]}>
        <AppText>{item.label}</AppText>
        {icon && <MaterialCommunityIcons name={icon} size={30} color={iconColor} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    pickerItem: {
        padding: 20,
        width: '100%',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})

export default PickerItem