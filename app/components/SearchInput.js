  import { View, StyleSheet, TouchableHighlight, TextInput } from 'react-native'
  import React from 'react'
  import {MaterialCommunityIcons} from '@expo/vector-icons'

  import { useTheme } from '../utils/ThemeContext'

  const SearchInput = ({iconColor, searchPress, onChangeText, value,inputStyle, ...otherProps}) => {
    const {theme} = useTheme()
    iconColor = iconColor || theme?.amberGlow
    return (
      <View style={[styles.searchBox,inputStyle, {borderColor: theme?.amberGlow,}]}>
        <TextInput 
          {...otherProps} 
          style={[styles.textInput, {color: theme?.amberGlow,}]} 
          value={value}
          onChangeText={onChangeText}
          selectionColor={theme?.text}
        />
        {searchPress && <TouchableHighlight 
          onPress={searchPress} 
          underlayColor={theme?.lighter}
          accessible={true}
          accessibilityLabel="Search"
          accessibilityHint='Double tap search for the product.'
        >
          <MaterialCommunityIcons name='store-search' size={30} color={iconColor} />
        </TouchableHighlight> }
        {/* {searchPress && <TouchableHighlight onPress={searchPress} style={styles.mic}>
          <MaterialCommunityIcons name='microphone' size={15} color={iconColor} />
        </TouchableHighlight>} */}
      </View>
    )
  }

  const styles = StyleSheet.create({
      searchBox: {
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          padding: 10,
          height: 50,
          borderWidth: 2,
          borderRadius: 5,
      },
      textInput: {
          flex: 1,
          height: "100%",
          padding: 2,
      },

  })

  export default SearchInput