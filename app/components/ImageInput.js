import React, {useEffect} from 'react';
import { View, StyleSheet, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

import Icon from './Icon';
import {useTheme} from '../utils/ThemeContext';
import useAuth from '../auth/useAuth';
import profilePic from '../api/profileImage'

function ImageInput({imageUri, onChangeImage, style}) {
    const {user} = useAuth()
    const {theme} = useTheme()

    // console.log("User from image input", user)

    const requestPermission = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!granted) alert("You need to enable permission to upload an image.")
      }
      useEffect(() => {
        requestPermission()
      }, []) 

    // const deleteImage = () => {
    //     onChangeImage(null)
    // }

    const handlePress = () => {
        selectImage()
    }

    const upLoadImageToServer = async (userId, imageFile) => {
        try {
            const response = await profilePic.uploadProfileImage(userId, imageFile.uri)

            // if(response.ok) {
            //     // console.log("Image uploaded successfully", response.data)
            // } else {
            //     // console.log("Error uploading an image", response.data)
            // }

        } catch (error) {
            console.log("Error uploading an image", error)

            if(error.response) {
                console.log('Response data:',error.response.data);
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                console.log('Request setup error:', error.message);
            }
        }
    }

    const selectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                quality: 0.6,
                allowsEditing: true,
                aspect: [1, 1],
                base64: true,
                presentationStyle: 'overFullScreen',
                exif: true,
            })
            if (!result.canceled) {
                const imageFile = { uri: result.assets[0].uri, type: 'image/jpeg' }
                onChangeImage(result.assets[0].uri)
                upLoadImageToServer(user?._id, imageFile)
                // console.log("Image selected", imageFile)
            }
        } catch (error) {
            console.log("Error reading an image", error)
        }
    }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
        <View style={[styles.container, style, {backgroundColor: theme?.horizon, borderColor: theme?.white}]}>
            {!imageUri && <Icon
                            iconName="camera"
                            size={50}
                            color={theme?.amberGlow}
                            />
            }
            {imageUri && <Image 
                            source={{uri: imageUri}}
                            style={styles.image}
                            />
            }
        </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
     width: 75,
     height: 75,
     alignSelf: "center",
     borderRadius: 50,
     justifyContent: "center",
     alignItems: "center",
     overflow: "hidden",
     borderWidth: 2,
  },
    image: {
        width: "100%",
        height: "100%",
    }
});

export default ImageInput;