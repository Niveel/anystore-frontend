import React, {createContext, useContext, useState} from 'react'

const BarcodeContext = createContext()

const BarcodePolicyProvider = ({children}) => {
    const [barcodeCameraAllow, setBarcodeCameraAllow] = useState(false)
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