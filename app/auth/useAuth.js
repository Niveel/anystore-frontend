import { useContext } from 'react';
import jwt_decode from 'jwt-decode';

import AuthContext from './context';
import authStorage from './storage'; 
import { useBarcodePolicy } from '../config/BarcodeContext';

export default useAuth = () => {
    const {user, setUser} = useContext(AuthContext)

    const {setBarcodeCameraAllow} = useBarcodePolicy();

    const logIn = (authToken) => {
        const user = jwt_decode(authToken);
        setUser(user)
        authStorage.storeToken(authToken)
    }

    const logOut = () => {
        setUser(null)
        authStorage.removeToken()
        setBarcodeCameraAllow(false);
    }

    return {user, logIn, logOut}
}