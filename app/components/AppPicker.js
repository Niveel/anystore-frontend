import { View, StyleSheet, Text, TouchableWithoutFeedback, Modal, Button, FlatList } from 'react-native'
import React, { useState } from 'react'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import colors from '../config/colors'
import appStyles from '../config/appStyles'
import AppText from './AppText'
import Screen from './Screen'
import PickerItem from './PickerItem'
import AppButton from './AppButton'

const AppPicker = ({color = colors.amberGlow, icon, size = 30,items, item, placeholder, onSelectItem,selectedItem, ...otherProps }) => {
  const [isVisible, setIsVisible] = useState(false)
  return (
    <>
      <TouchableWithoutFeedback onPress={()=> setIsVisible(true)}>
        <View style={styles.inputContainer}>
            {item && <Text style={styles.text}>{item.label}</Text>}
            <View style={styles.inputBox}>
                {icon && <MaterialCommunityIcons name={icon} size={size} color={color} />}
                <AppText style={[appStyles.text, styles.input]} {...otherProps} >{selectedItem ? selectedItem.label : placeholder}</AppText>
                <MaterialCommunityIcons name="chevron-down" size={30} style={styles.icon} />
            </View>
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={isVisible} animationType="slide" >
        <Screen style={styles.modal}>
          <AppButton title="Close" color={colors.punch} width='50%' style={{alignSelf: "center", marginBottom: 20}} onPress={()=> setIsVisible(false)} />
          <FlatList 
            data={items}
            keyExtractor={item => item.value.toString()}
            renderItem={({item})=> <PickerItem 
            item={item}
            label={item.label}
            icon={item.icon}
            onPress={()=> {
              setIsVisible(false)
              onSelectItem(item)
            }} 
            />}
            ItemSeparatorComponent={()=><View style={{width: '100%', height: 10, backgroundColor: "transparent"}} />}
          />
        </Screen>
      </Modal>
    </>

  )
}

const styles = StyleSheet.create({
    inputBox: {
        backgroundColor: "transparent",
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        gap: 5,
        width: '90%',
        height: 50,
        marginHorizontal: "auto",
        borderRadius: 5,
        borderColor: colors.amberGlow,
        borderWidth: 1,

    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 5,
    },
    icon: {
        color: colors.amberGlow,
        marginLeft: 'auto',
    },
    modal: {
      backgroundColor: colors.midnight,
      paddingHorizontal: 10,
    },
    text: {
        fontSize: 14,
        textAlign: 'left',
        color: colors.amberGlow,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        width: '90%',
        marginBottom: 5,
        marginHorizontal: "auto",
    }

})
export default AppPicker