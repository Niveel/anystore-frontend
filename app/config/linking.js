import * as Linking from 'expo-linking';

export const linking = {
  prefixes: ['shopwit://', 'https://shopwit.com'],
  config: {
    screens: {
      App: {
        path: 'app',
        screens: {
          ProductDetails: 'product/:id',
        },
      },
    },
  },
};
