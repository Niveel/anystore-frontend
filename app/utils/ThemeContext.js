import React, {createContext, useContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const themes = {
    default: {
        white: '#fff',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.2)',  
        midnight: '#f1f8ff', // background color
        midnightLight: 'rgba(127, 154, 189,.2)', // text color
        horizon: '#008081', // bg color
        misty: '#001F3F', // bg color
        mistyLight: 'rgba(106, 147, 186,.3)', // bg color
        amberGlow: '#ecb245', //border color
        amberGlowLight: 'rgba(255, 133, 27, .8)', //border color
        punch: '#ff0000', // accent color
        text: '#001F3E',
    },
    horizon: {
        white: '#fff',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.2)',  
        midnight: '#dee7f8', // background color
        midnightLight: 'rgba(106, 147, 186,.3)', // text color
        horizon: '#2e528a', // bg color
        misty: '#1a2f56', // bg color
        mistyLight: 'rgba(127, 154, 189,.6)', // bg color
        amberGlow: '#f5b042', //border color
        amberGlowLight: 'rgba(247, 156, 11,.8)', //border color
        punch: '#d94f30', // accent color
        text: '#080538',
    },
    light: {
        white: '#fff',
        light: 'rgba(6,6,6,0.2)',
        lighter: 'rgba(6,6,6,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.06)',
        midnight: '#fff', // background color
        midnightLight: 'rgba(116, 174, 218,.2)', // text color 
        horizon: '#1ca083', // bg color
        misty: '#12578b', // bg color
        mistyLight: 'rgba(87, 135, 177, .3)', // bg color
        amberGlow: '#db9704', //border color
        amberGlowLight: 'rgba(175, 125, 16,.8)', //border color
        punch: '#ac4001', // accent color
        text: '#000',
    },
    dark: {
        white: '#000',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#fff', 
        blackLight: 'rgba(255,255,255,.2)',
        midnight: '#000', // background color
        midnightLight: 'rgba(216, 216, 2166, .2)', // text color
        horizon: '#6d7df8', // bg color
        misty: '#1f75f5', // bg color
        mistyLight: 'rgba(67, 126, 214,.6)', // bg color
        amberGlow: '#e2521d', //border color
        amberGlowLight: 'rgba(199, 193, 16,.8)', //border color
        punch: '#f53730', // accent color
        text: '#fff',
    },
    aquarium: {
        white: '#fff',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#ceccc8',
        blackLight: 'rgba(0,0,0,.1)',
        midnight: '#1b4c5a', // background color
        midnightLight: 'rgba(31, 79, 92, .2)', // text color
        horizon: '#38aec0', // bg color
        misty: '#55aab9', // bg color
        mistyLight: 'rgba(76, 141, 154, .6)', // bg color
        amberGlow: '#38f1e5', //border color
        amberGlowLight: 'rgba(144, 198, 194, .8)', //border color
        punch: '#e67a14', // accent color
        text: '#fff',
    },
    summer: {
        white: '#fff',
        light: 'rgba(224, 210, 210, 0.5)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#fff',
        blackLight: 'rgba(0,0,0,.1)',
        midnight: '#4b4f68', // background color
        midnightLight: 'rgba(31, 79, 92, .2)', // text color
        horizon: '#119186', // bg color
        misty: '#21a584', // bg color
        mistyLight: 'rgba(54, 238, 224,.6)', // bg color
        amberGlow: '#25e69c', //border color
        amberGlowLight: 'rgba(63, 206, 151,.8)', //border color
        punch: '#F652A0', // accent color
        text: '#fff',
    },
    christmas: {
        white: '#fff',
        light: 'rgba(224, 210, 210, 0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#d4d0d0',
        blackLight: 'rgba(0,0,0,.1)',
        midnight: '#7e121d', // background color
        midnightLight: 'rgba(126, 18, 29,.2)', // text color
        horizon: '#f5625f', // bg color
        misty: '#b48518', // bg color
        mistyLight: 'rgba(206, 172, 92,.6)', // bg color
        amberGlow: '#eccd41', //border color
        amberGlowLight: 'rgba(236, 205, 65,.8)', //border color
        punch: '#0aaf3e', // accent color
        text: '#ecdbdb',
    },
};

const ThemeContext = createContext();

const THEME_KEY = 'appTheme';

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(themes.default);

    useEffect(() => {
        const getTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(THEME_KEY);

                if (storedTheme) {
                    setTheme(themes[storedTheme]);
                }
            } catch (error) {
                console.error('Failed to load theme:', error);
            }
            
        }
        getTheme();
    }, []);

    const toggleTheme = async (themeName) => {
        const selectedTheme = themes[themeName];
        setTheme(selectedTheme);

        try {
            await AsyncStorage.setItem(THEME_KEY, themeName);
          } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}