import { StyleSheet, Text } from 'react-native'
import React from 'react'

import appStyles from '../config/appStyles'
const AppText = ({children, style, ...otherProps}) => {
  return (
   <Text style={[appStyles.text,style]} {...otherProps}>{children}</Text>
  )
}

export default AppText