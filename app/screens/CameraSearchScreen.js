import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Camera } from 'expo-camera';

import { useTheme } from '../utils/ThemeContext';
import AppText from '../components/AppText';
import Icon from '../components/Icon';
import cameraBg from '../assets/camera_bg.jpeg';
import AppBottomSheet from '../components/AppBottomSheet';

const { width, height } = Dimensions.get("window");

const CameraSearchScreen = ({navigation}) => {
    const {theme} = useTheme();
    const [hasPermission, setHasPermission] = useState(null); 
    const [cameraRef, setCameraRef] = useState(null); 
    const [photoTaken, setPhotoTaken] = useState(false); 
    const [imageUri, setImageUri] = useState(null); 
    const bottomSheetRef = useRef(null);

    useEffect(() => {
        // Request camera permission
        const requestPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        requestPermission();
    }, []);

    // Capture image when button is pressed
    const takePicture = async () => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.takePictureAsync({ base64: true });
                console.log("Photo taken: ", photo.uri);
                setImageUri(photo.uri); 
                setPhotoTaken(true); 
                bottomSheetRef.current.open();
                console.log("bottom sheet ref", bottomSheetRef.current);
                // sendImageToBackend(photo.base64); 
            } catch (error) {
                console.log("Error taking picture: ", error);
            }
        }
    };

    // Send the image to the backend for search
    const sendImageToBackend = async (base64Image) => {
        try {
            const response = await fetch('https://your-backend-api-url.com/search-by-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image, 
                }),
            });

            const result = await response.json();
            console.log("Search results: ", result); 
        } catch (error) {
            console.error("Error sending image to backend: ", error);
        }
    };

    if (hasPermission === null) {
        return <AppText>Requesting camera permission...</AppText>;
    }
    if (hasPermission === false) {
        return <AppText>No access to camera</AppText>;
    }

  return (
    <View style={[styles.container, {
        backgroundColor: theme.midnight,
    }]}>
        <TouchableOpacity
            style={[styles.closeBtn, {
                backgroundColor: theme.midnightLight,
            }]}
            onPress={() => navigation.goBack()}
        >
            <Icon
                name="close"
                size={30}
                color={theme.white}
                style={styles.icon}
            />
        </TouchableOpacity>
        {/* info container */}
        <View style={[styles.infoContainer, {
            backgroundColor: theme.misty,
        }]}>
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <AppText 
                    color={theme?.midnight}
                    style={{
                        fontSize: 20,
                        textAlign: "center",
                    }}
                >Search with an image. </AppText>
                <AppText 
                    color={theme?.midnight}
                    style={{
                        fontSize: 12,
                        textAlign: "center",
                    }}
                    >You need to allow access to your camera to search by image</AppText>
            </View>
            <View style={styles.infoBox}>
                <Image
                    source={cameraBg}
                    style={styles.infoImage}
                />
                <View style={[styles.overlay, {
                    backgroundColor: theme.blackLight,
                }]}>
                    <AppText
                        style={{
                            fontSize: 16,
                        }}
                        color={theme.white}
                    >Take a pic to search</AppText>
                    <AppText
                        style={{
                            fontSize: 16,
                        }}
                        color={theme.white}
                    >for similar products</AppText>
                </View>
            </View>
        </View>
        {/* end of info container */}
        {/* camera container */}
        <View style={styles.cameraContainer}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={ref => {
                    setCameraRef(ref);
                }}
            />
            {/* take picture button */}
            <TouchableOpacity
                style={[styles.captureButton, {
                    backgroundColor: theme.mistyLight,
                }]}
                onPress={takePicture}
            >
                <Icon
                    name="camera"
                    size={50}
                    color={theme.white}
                />
            </TouchableOpacity>
            {/* end of take picture button */}
            {photoTaken && (
                <>
                {/* <AppBottomSheet ref={bottomSheetRef}>
                    <View style={styles.bottomSheetInner}>
                        <Image
                            source={{uri: imageUri}}
                            style={{
                                width: 200,
                                aspectRatio: 1 / 1,
                            }}
                        />
                    </View>
                </AppBottomSheet> */}
                <View style={[styles.resultsWrapper, {
                    backgroundColor: theme.midnight,
                }]}>
                    <TouchableOpacity
                        style={[styles.closeBtn, {
                            backgroundColor: theme.horizon,
                        }]}
                        onPress={() => {
                            setPhotoTaken(false);
                            setImageUri(null);
                        }}
                    >
                        <Icon
                            name="close"
                            size={30}
                            color={theme.white}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <Image
                        source={{uri: imageUri}}
                        style={{
                            width: 200,
                            aspectRatio: 1 / 1.5,
                            borderRadius: 30,
                        }}
                    />
                </View>
                </>
            )}
        </View>
        {/* end of camera container */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    infoContainer: {
        flex: 1,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        padding: 10,
    },
    infoBox: {
        width: "100%",
        height: height / 7,
        borderRadius: 20,
        overflow: "hidden",
    },
    cameraContainer: {
        flex: 2.5,
        marginTop: -50,
    },
    infoImage: {
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        borderRadius: 20,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: 20,
    },
    closeBtn: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 2,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    camera: {
        flex: 1,
    },
    photoTaken: {
        height: 50,
        width: 150,
        justifyContent: "center",
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        position: "absolute",
        bottom: 30,
        left: width / 2 - 35,
        justifyContent: "center",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
        opacity: 0.8
    },
    bottomSheetInner: {
        backgroundColor: "green",
        zIndex: 3,
        flex: 1,
    },
    resultsWrapper: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 3,
    }
});

export default CameraSearchScreen;