import { StyleSheet } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'

import AppButton from '../AppButton'

const SubmitButton = ({title,...otherProps}) => {

  const { handleSubmit } = useFormikContext()

  return (
    <AppButton title={title} style={styles.submit} {...otherProps} onPress={handleSubmit}/>
  )
}

const styles = StyleSheet.create({
  submit: {
    alignSelf: "center",
    marginTop: 20,
  }
})

export default SubmitButton