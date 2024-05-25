import { View, StyleSheet, TouchableHighlight, TextInput } from 'react-native'
import React from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import AppInput from './AppInput'
import colors from '../config/colors'

const SearchInput = ({iconColor = colors.amberGlow, searchPress, onChangeText, value, ...otherProps}) => {
  return (
    <View style={styles.searchBox}>
      <TextInput 
        {...otherProps} 
        style={styles.textInput} 
        value={value}
        onChangeText={onChangeText}
      />
      {searchPress &&<TouchableHighlight onPress={searchPress}>
        <MaterialCommunityIcons name='store-search' size={30} color={iconColor} />
      </TouchableHighlight> }
       {/* {searchPress && <TouchableHighlight onPress={searchPress} style={styles.mic}>
        <MaterialCommunityIcons name='microphone' size={15} color={iconColor} />
      </TouchableHighlight>} */}
    </View>
  )
}

const styles = StyleSheet.create({
    mic: {
        backgroundColor: colors.light,
        padding: 3,
        borderRadius: 5,
    },
    searchBox: {
        width: "90%",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        padding: 10,
        height: 50,
        borderColor: colors.amberGlow,
        borderWidth: 1,
        borderRadius: 5,
    },
    textInput: {
        flex: 1,
        height: "100%",
        padding: 5,
        color: colors.amberGlow,
    },

})

export default SearchInput