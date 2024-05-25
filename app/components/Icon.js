import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

const Icon = ({iconName, ...otherPops}) => {
  return (
    <MaterialCommunityIcons name={iconName} {...otherPops}/>
  )
}

export default Icon