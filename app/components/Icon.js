import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

const Icon = ({iconName, size, color, ...otherPops}) => {
  return (
    <MaterialCommunityIcons name={iconName} size={size} color={color} {...otherPops}/>
  )
}

export default Icon