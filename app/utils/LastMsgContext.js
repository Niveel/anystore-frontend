import React, {createContext, useContext, useState} from 'react';

const LastMsgContext = createContext();

const LastMsgProvider = ({children}) => {
    const [lastMsg, setLastMsg] = useState('');

    return (
        <LastMsgContext.Provider value={{lastMsg, setLastMsg}}>
            {children}
        </LastMsgContext.Provider>
    );
}

const useLastMsg = () => {
    const context = useContext(LastMsgContext);
    if (!context) {
        throw new Error('useLastMsg must be used within a LastMsgProvider');
    }
    return context;
}

export {LastMsgProvider, useLastMsg};

