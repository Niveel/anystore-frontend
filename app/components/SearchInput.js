  import { View, StyleSheet, TouchableHighlight, TextInput, useWindowDimensions } from 'react-native'
  import React from 'react'
  import {MaterialCommunityIcons} from '@expo/vector-icons'

  import { useTheme } from '../utils/ThemeContext'

  const SearchInput = ({iconColor, searchPress, cameraSearchPress, onChangeText, value,inputStyle, ...otherProps}) => {
    const {theme} = useTheme()
    iconColor = iconColor || theme?.amberGlow

    const {width} = useWindowDimensions()

    return (
      <View style={[styles.searchBox,inputStyle, {borderColor: theme?.horizon,}]}>
        {cameraSearchPress && <TouchableHighlight 
          onPress={cameraSearchPress} 
          underlayColor={theme?.lighter}
          accessible={true}
          accessibilityLabel="Search by image"
          accessibilityHint='Double tap search for the product by image.'
          style={styles.searchBtn}
        >
          <MaterialCommunityIcons name='camera-outline' size={width > 390 ? 35 : 25} color={iconColor} />
        </TouchableHighlight> }
        <TextInput 
          {...otherProps} 
          style={[styles.textInput, {color: theme?.horizon,}]} 
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
          style={styles.searchBtn}
        >
          <MaterialCommunityIcons name='magnify' size={width > 390 ? 35 : 25} color={iconColor} />
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
          gap: 8,
          paddingHorizontal: 5,
          height: 45,
          borderWidth: 2,
          borderRadius: 30,
          overflow: "hidden",
      },
      textInput: {
          flex: 1,
          height: "100%",
          paddingHorizontal: 2,
      },
      searchBtn: {
        backgroundColor: "transparent",
        height: "100%",
        width: 35,
        alignItems: "center",
        justifyContent: "center",
      }

  })

  export default SearchInput