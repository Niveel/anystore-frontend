import React from 'react';
import { View, StyleSheet, ScrollView, } from 'react-native';

import Screen from '../components/Screen';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { useTheme } from '../utils/ThemeContext';
import routes from '../navigation/routes';

function ProductInfoScreen({ route, navigation }) {
  const {productData, product} = route.params;
  const { theme } = useTheme();

  return (
    <Screen style={[styles.screen, { backgroundColor: theme?.midnight }]}>
      <View style={{
          height: "100%", 
          justifyContent: "space-between", 
          padding: 10,
        }}>
          <ScrollView
            style={{
              height: "100%"
            }}
          >
            <View>
              <AppText>{productData?.description}</AppText>
            </View>
        </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 20,
              }}
            >
              <AppButton
                title="Ask CAFA"
                color={theme?.amberGlowLight}
                style={styles.buttonStyle}
                textStyle={styles.buttonTextStyle}
                onPress={() => navigation.navigate(routes.CAFA, {product})}
              />
            </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    paddingTop: 0,
  },
  buttonStyle: {
    borderRadius: 5,
    marginVertical: 10,
    width: 'max-content',
    paddingHorizontal: 10,
    height: 40,
    alignSelf: 'center',
  },
  buttonTextStyle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default ProductInfoScreen;
