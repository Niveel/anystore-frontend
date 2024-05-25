import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as Yup from 'yup';

import colors from '../config/colors';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import Screen from '../components/Screen';

const validationSchema = Yup.object().shape({
    username: Yup.string().required().label("Name").min(3),
})

const NameResetScreen = ({navigation}) => {

    const handleChangeName = (name) => {
        console.log(name)
    }
  return ( 
    <Screen style={styles.screen}>
        <View style={styles.container}>
            <AppForm
                initialValues={{username: ""}}
                onSubmit={handleChangeName}
                validationSchema={validationSchema}
            >
            <AppFormField
                name="username"
                autoCapitalize="none"
                autoCorrect={false}
                icon="account"
                placeholder="Enter new name"
                placeholderTextColor={colors.misty}
                textContentType="name"
            />
            <SubmitButton 
                title="Change name" 
                width="90%"
                color={colors.amberGlow}
                textColor={colors.midnight}
            />
            </AppForm>
        </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.midnight,
    },  
})

export default NameResetScreen