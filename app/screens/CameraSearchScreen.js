import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Text, } from 'react-native';
import { Camera, WhiteBalance } from 'expo-camera';

import { useTheme } from '../utils/ThemeContext';
import AppText from '../components/AppText';
import Icon from '../components/Icon';
import cameraBg from '../assets/camera_bg.jpeg';
import AppBottomSheet from '../components/AppBottomSheet';
import ProductCard from '../components/ProductCard';
import CircleLoader from '../components/loaders/CircleLoader';
import imageSearch from '../api/imageSearch';
import DescriptionModal from '../components/modals/DescriptionModal';
import productsApi from '../api/products';
import ListItem from '../components/ListItem';
import ItemLoader from '../components/loaders/ItemLoader';

const { width, height } = Dimensions.get("window");

const CameraSearchScreen = ({navigation}) => {
    const {theme} = useTheme();
    const [hasPermission, setHasPermission] = useState(null); 
    const [cameraRef, setCameraRef] = useState(null); 
    const [photoTaken, setPhotoTaken] = useState(false); 
    const [imageUri, setImageUri] = useState(null); 
    const bottomSheetRef = useRef(null);
    const [photoShootLoading, setPhotoShootLoading] = useState(false);
    const [photoShootError, setPhotoShootError] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [query, setQuery] = useState("");

    useEffect(() => {
        // Request camera permission
        const requestPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        requestPermission();
    }, []);

    // Capture image
    const takePicture = async () => {
        if (cameraRef) {
            setPhotoShootLoading(true);
            try {
                const photo = await cameraRef.takePictureAsync({ 
                    quality: 0.6,
                    skipProcessing: true,
                    // exposure: 2.0,
                    exposureMode: Camera.Constants.WhiteBalance.auto,
                    base64: false,
                    width: 200,
                    height: 200,
                });

                setProductsLoading(true);
                // console.log("Photo taken: ", photo.uri);
                sendImageToBackend(photo.uri); 
                setImageUri(photo.uri); 
                setPhotoTaken(true); 
                bottomSheetRef?.current?.open();
            } catch (error) {
                console.log("Error taking picture: ", error);
                setPhotoShootError(true);
            } finally {
                setPhotoShootLoading(false); 
            }
        }
    };

    const searchForProducts = async (query) => {
        try {
            // console.log("Searching for products with query: ", query);
            const response = await productsApi.searchProducts(query);

            setQuery(query);
6
            if (response.ok) {
                setProducts(response.data);
            } else {
                console.log("Error searching for products: ", response.data);
            }
        } catch (error) {
            console.error("Error searching for products (error): ", error);
        } finally {
            setProductsLoading(false);
        }
    }

    const sendImageToBackend = async (image) => {
        try {
            const response = await imageSearch.uploadImageToSearch(image);

            if (response.ok) {
                const requestQuery = response?.data?.query

                if (requestQuery) {
                    searchForProducts(requestQuery);
                } else {
                    console.log("No query found in response: ", response.data);
                }

            } else {
                console.log("Error sending image to backend: ", response.data);
            }
        } catch (error) {
            console.error("Error sending image to backend : ", error);
        }
    };

    // console.log("Products: ", products);

    const closeBottomSheet = () => {
        setPhotoTaken(false);
        setImageUri(null);
        setProducts([]);
        setQuery("");
    };

    // render item for the bottom sheet (products)
    const renderItem = ({item}) => (
        <ProductCard
            item={item}
            name={item.title}
            image={item.images}
            price={item.price}
            rating={item.rating}
            companyName={item.shop_name}
            addToCartVisible
            width={width / 2.5}
            height={height / 4}
        />
    )

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
        {!photoTaken && <View style={[styles.infoContainer, {
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
        </View>}
        {/* end of info container */}
        {/* camera container */}
        <View style={styles.cameraContainer}>
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                ref={ref => {
                    setCameraRef(ref);
                }}
                useCamera2Api={true}
            />
            {/* take picture button */}
            {!photoTaken && <TouchableOpacity
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
            </TouchableOpacity>}
            {/* end of take picture button */}
            {/* when photo shoot is loading */}
            {photoShootLoading && 
            <View style={[styles.photoShootLoader, {
                backgroundColor: theme?.mistyLight,
            }]}>
                <CircleLoader size={50} color={theme.horizon} />
            </View>}
        </View>
        {/* end of camera container */}
        <AppBottomSheet 
            ref={bottomSheetRef}
            onClose={closeBottomSheet}
            data={products}
            renderItem={renderItem}
            contentContainerStyle={[styles.productsContainer,{
                backgroundColor: theme?.mistyLight,
            }]}
        >
                <View style={[styles.bottomSheetInner, {
                    backgroundColor: theme?.midnight,
                }]}>
                    {/* image preview */}
                    <View style={styles.imagePreview}>
                        <Image
                            source={{uri: imageUri}}
                            style={styles.imageTaken}
                        />
                        <View style={[styles.previewInfoBox, {
                            backgroundColor: theme.misty,
                        }]}>
                            <View>
                                <Text style={{
                                    color: theme?.amberGlow,
                                    fontSize: 16,
                                    fontWeight: "bold",
                                }}>{query}</Text>
                            </View>
                            <View>
                                <Text style={[styles.previewText, {
                                    color: theme?.midnight,
                                }]}>We found these products</Text>
                                <Text style={[styles.previewText, {
                                    color: theme?.midnight,
                                }]}>based on the photo you just took.</Text>
                            </View>
                        </View>
                    </View>
                    {/* end of image preview */}
                    <View style={[styles.resultsPlaceholderBox, {
                        height: productsLoading || products.length === 0 ? 290 : 0,
                    }]}>
                        {products?.length === 0 && 
                            <ListItem
                                title="No result found"
                                subtitle="Try searching with another image or let the image be brighter."
                                style={{ color: theme?.horizon, fontSize: 18, fontWeight: "bold" }}
                                IconComponent={
                                    <Icon iconName="alert-circle" size={35} color={theme?.punch} />
                                }
                            />}
                        <ItemLoader visible={productsLoading} />
                    </View>
                </View>
        </AppBottomSheet>

        {/* photo error modal */}
        <DescriptionModal
            header='Photo Error'
            visible={photoShootError}
            closeModal={() => setPhotoShootError(false)}
        >
            <View style={styles.photoModalInner}>
                <AppText color={theme?.punch}>Could'nt successfully capture image!</AppText>
                <AppText color={theme?.punch}>Please try again.</AppText>
            </View>
        </DescriptionModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    infoContainer: {
        flex: 1,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
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
    photoShootLoader: {
        position: "absolute",
        bottom: 22,
        width: width / 2 - 40,
        left: width / 4 + 20,
        height: 85,
        borderRadius: 20,
        zIndex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    imagePreview: {
        width: "100%",
        padding: 10,
        flexDirection: "row",
        gap: 10,
    },
    imageTaken: {
        width: 120,
        aspectRatio: 1,
        borderRadius: 20,
        // resizeMode: "cover",
    },
    previewInfoBox: {
        flex: 1,
        padding: 10,
        borderRadius: 20,
        gap: 5,
        justifyContent: "space-between",
    },
    previewText: {
        fontSize: 12,
        fontWeight: "900",
    },
    productsContainer: {
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        // flex: 1,
    },
    bottomSheetInner: {
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        padding: 20,
    },
    photoModalInner: {
        flex: 1,
    },
    resultsPlaceholderBox: {
        width: "100%",
    }
    
});

export default CameraSearchScreen;