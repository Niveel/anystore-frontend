import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Audio } from 'expo-av';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';

const copy_sound = '../assets/sounds/copy_sound.mp3';

function MsgLongPressOptions({style, deleteMsg, reportMsg, messages, deselectMsgs}) {
    const [sound, setSound] = useState();
    const {theme} = useTheme();

    const PlayCopySound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require(copy_sound)
        );
        setSound(sound);
        await sound.playAsync();
    }

    const showCopiedToast = () => {
        ToastAndroid.show('Messages copied to clipboard.', ToastAndroid.SHORT);
        PlayCopySound();
    }

    const showNoMsgsToast = () => {
        ToastAndroid.show('There are no messages to copy.', ToastAndroid.SHORT);
    }

    const handleCopyMessages = async () => {
        if(messages && messages.length > 0) {
            deselectMsgs();
            const copiedMessages = messages.map(msg => msg?.content).join('\n');
            await Clipboard.setStringAsync(copiedMessages);
            showCopiedToast();
        } else {
            showNoMsgsToast();
        }
    }

    // Unload sound when component unmounts
    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);
    

  return (
    <View 
        style={[styles.container, style]}
        accessible={true}
        accessibilityLabel="Message options menu"
    >
        <View style={styles.row}>
            <TouchableOpacity style={[styles.button, {backgroundColor: theme?.amberGlow,}]} onPress={deleteMsg}>
                <AppText style={styles.buttonText} color={theme?.midnight}>Delete</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: theme?.amberGlow,}]} onPress={handleCopyMessages}>
                <AppText style={styles.buttonText} color={theme?.midnight}>Copy</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: theme?.amberGlow,}]} onPress={reportMsg}>
                <AppText style={styles.buttonText} color={theme?.midnight}>Report</AppText>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: 'center',
  },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    },
    buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    },
});

export default MsgLongPressOptions;