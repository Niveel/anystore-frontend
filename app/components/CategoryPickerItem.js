import { View, Text } from 'react-native'
import React from 'react'

import Icon from './Icon'

const CategoryPickerItem = ({item, label, onPress}) => {
  return (
    <View>
      <Icon iconName={item.icon}  />
    </View>
  )
}

export default CategoryPickerItem