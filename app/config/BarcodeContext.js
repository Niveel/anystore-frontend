import React, {createContext, useContext, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BarcodeContext = createContext()

const BarcodePolicyProvider = ({children}) => {
    const [barcodeCameraAllow, setBarcodeCameraAllow] = useState(()=> {
      const storedValue = AsyncStorage.getItem('policyAccepted')
      return storedValue === 'true'
    })
  return (
    <BarcodeContext.Provider value={{barcodeCameraAllow, setBarcodeCameraAllow}}>
        {children}
    </BarcodeContext.Provider>
  )
}

export const useBarcodePolicy = () => {
    const context = useContext(BarcodeContext)
    if (!context) {
        throw new Error('useBarcodePolicy must be used within a BarcodePolicyProvider')
    }
    return context
}

export default BarcodePolicyProvider