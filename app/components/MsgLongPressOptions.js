import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Audio } from 'expo-av';

import AppText from './AppText';
import { useTheme } from '../utils/ThemeContext';

const copy_sound = '../assets/sounds/copy_sound.mp3';

function MsgLongPressOptions({style, deleteMsg, reportMsg, messages, deselectMsgs, flagMsg, unFlagMsg, isFlagged=false}) {
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

    const handleFlagToggle = () => {
        if(isFlagged){
            unFlagMsg()
            PlayCopySound();
        } else {
            flagMsg()
            PlayCopySound();
        }
        deselectMsgs()
    }

    // Unload sound when component unmounts
    useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);

      const buttonBgColor = theme?.horizon;
    

  return (
    <View 
        style={[styles.container, style]}
        accessible={true}
        accessibilityLabel="Message options menu"
    >
        <View style={styles.row}>
            <TouchableOpacity style={[styles.button, {backgroundColor: buttonBgColor,}]} onPress={deleteMsg}>
                <AppText style={styles.buttonText} color={theme?.midnight}>Delete</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: buttonBgColor,}]} onPress={handleCopyMessages}>
                <AppText style={styles.buttonText} color={theme?.midnight}>Copy</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: buttonBgColor,}]} onPress={reportMsg}>
                <AppText style={styles.buttonText} color={theme?.midnight}>Report</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: buttonBgColor,}]} onPress={handleFlagToggle}>
                <AppText style={styles.buttonText} color={theme?.midnight}>{isFlagged? "Unflag" : "Flag"}</AppText>
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    },
    buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    },
});

export default MsgLongPressOptions;