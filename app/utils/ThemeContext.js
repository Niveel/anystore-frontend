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
        midnightLight: 'rgba(0, 128, 129, .05)', // text color
        horizon: '#008081', // bg color
        misty: '#001F3F', // bg color
        mistyLight: 'rgba(127, 154, 189,.6)', // bg color
        amberGlow: '#ecb245', //border color
        amberGlowLight: 'rgba(255, 133, 27, .8)', //border color
        punch: '#ff0000', // accent color
        text: '#001F3E',
    },
    horizon: {
        white: '#f4f1e4',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.2)',  
        midnight: '#1a2f56', // background color
        midnightLight: 'rgba(106, 147, 186,.3)', // text color
        horizon: '#425d85', // bg color
        misty: '#7f9abd', // bg color
        mistyLight: 'rgba(127, 154, 189,.6)', // bg color
        amberGlow: '#f5b042', //border color
        amberGlowLight: 'rgba(245, 176, 66,.8)', //border color
        punch: '#d94f30', // accent color
        text: '#f4f1e4',
    },
    light: {
        white: '#eef4f5',
        light: 'rgba(6,6,6,0.2)',
        lighter: 'rgba(6,6,6,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.06)',
        midnight: '#f0f8ff', // background color
        midnightLight: 'rgba(240, 248, 255,.3)', // text color 
        horizon: '#87b1d1', // bg color
        misty: '#507088', // bg color
        mistyLight: 'rgba(80, 112, 136,.6)', // bg color
        amberGlow: '#db9704', //border color
        amberGlowLight: 'rgba(243, 181, 49,.8)', //border color
        punch: '#ac4001', // accent color
        text: '#000',
    },
    dark: {
        white: '#fff',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#fff', 
        blackLight: 'rgba(255,255,255,.1)',
        midnight: '#4d4545', // background color
        midnightLight: 'rgba(26, 26, 26, .3)', // text color
        horizon: '#8d845e', // bg color
        misty: '#1a1a1a', // bg color
        mistyLight: 'rgba(89, 89, 89,.6)', // bg color
        amberGlow: '#c7c110', //border color
        amberGlowLight: 'rgba(199, 193, 16,.8)', //border color
        punch: '#f53730', // accent color
        text: '#fff',
    },
    aquarium: {
        white: '#fff',
        light: 'rgba(255,255,255,0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.1)',
        midnight: '#1f4f5c', // background color
        midnightLight: 'rgba(31, 79, 92, .4)', // text color
        horizon: '#2a6e79', // bg color
        misty: '#62bfcf', // bg color
        mistyLight: 'rgba(76, 141, 154, .6)', // bg color
        amberGlow: '#2adfd3', //border color
        amberGlowLight: 'rgba(144, 198, 194, .8)', //border color
        punch: '#e67a14', // accent color
        text: '#fff',
    },
    summer: {
        white: '#fff',
        light: 'rgba(224, 210, 210, 0.5)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.1)',
        midnight: '#4b4f68', // background color
        midnightLight: 'rgba(31, 79, 92, .4)', // text color
        horizon: '#119186', // bg color
        misty: '#27c29b', // bg color
        mistyLight: 'rgba(54, 238, 224,.6)', // bg color
        amberGlow: '#2bcc8e', //border color
        amberGlowLight: 'rgba(63, 206, 151,.8)', //border color
        punch: '#F652A0', // accent color
        text: '#2c2a2a',
    },
    christmas: {
        white: '#fff',
        light: 'rgba(224, 210, 210, 0.2)',
        lighter: 'rgba(255,255,255,0.1)',
        black: '#000',
        blackLight: 'rgba(0,0,0,.1)',
        midnight: '#7e121d', // background color
        midnightLight: 'rgba(126, 18, 29,.4)', // text color
        horizon: '#bd3634', // bg color
        misty: '#ceac5c', // bg color
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