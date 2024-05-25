import React, {useEffect} from 'react';
import { View, StyleSheet, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import axios from 'axios'

import Icon from './Icon';
import colors from '../config/colors';
import useAuth from '../auth/useAuth';

function ImageInput({imageUri, onChangeImage}) {
    const {user} = useAuth()

    const requestPermission = async () => {
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!granted) alert("You need to enable permission to upload an image.")
      }
      useEffect(() => {
        requestPermission()
      }, []) 

    const handlePress = () => {
        if (!imageUri) selectImage()
        else Alert.alert("Delete", "Are you sure you want to delete this image? You must delete the current image to upload another.", [
            {text: "Yes", onPress: ()=> onChangeImage(null)},
            {text: "No"}
        ])
    }

    const upLoadImageToServer = async (userId, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('profileImage', {
                uri: imageFile.uri,
                type: imageFile.type,
                name: 'profile.jpg',
            });
            formData.append('userId', userId);

            const response = await axios.post('https://pacific-sierra-04938-5becb39a6e4f.herokuapp.com/api/upload-profile-image', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
          
              console.log("Image posting",response.data);
              return response.data;
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
                quality: 0.5,
                allowsEditing: true,
                aspect: [1, 1]
            })
            if (!result.canceled) {
                const imageFile = { uri: result.assets[0].uri, type: 'image/jpeg' }
                onChangeImage(result.assets[0].uri)
                upLoadImageToServer(user?._id, imageFile)
                console.log("Image selected", imageFile)
            }
        } catch (error) {
            console.log("Error reading an image", error)
        }
    }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.container}>
            {!imageUri && <Icon
                            iconName="camera"
                            size={50}
                            color={colors.amberGlow}
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
     width: 100,
     height: 100,
     alignSelf: "center",
     backgroundColor: colors.mistyLight,
     borderRadius: 50,
     justifyContent: "center",
     alignItems: "center",
     overflow: "hidden",
  },
    image: {
        width: "100%",
        height: "100%",
    }
});

export default ImageInput;