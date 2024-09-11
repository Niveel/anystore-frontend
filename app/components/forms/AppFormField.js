import React from 'react'
import { useFormikContext } from 'formik'

import AppInput from '../AppInput'
import ErrorMessage from './ErrorMessage'

const AppFormField = ({name, ...otherProps}) => {
  const {setFieldTouched, handleChange, errors, touched} = useFormikContext()

  return (
    <>
      <AppInput 
        onChangeText={handleChange(name)}
        onBlur={()=> setFieldTouched(name)}
        height={40}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
    
  )
}

export default AppFormField