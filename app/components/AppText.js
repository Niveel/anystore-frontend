import { Text } from 'react-native'
import React from 'react'

import appStyles from '../config/appStyles'
import { useTheme } from '../utils/ThemeContext'

const AppText = ({children, style,color, ...otherProps}) => {
  const {theme} = useTheme()
  color = color || theme?.text
  return (
   <Text style={[appStyles.text,style, {color: color}]} {...otherProps}>{children}</Text>
  )
}

export default AppText