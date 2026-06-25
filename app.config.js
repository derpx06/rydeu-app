const appJson = require('./app.json');

module.exports = ({ config }) => {
  const googleKey = process.env.EXPO_PUBLIC_GOOGLE_KEY;

  return {
    ...config,
    ...appJson.expo,
    android: {
      ...appJson.expo.android,
      config: {
        ...appJson.expo.android?.config,
        googleMaps: {
          ...appJson.expo.android?.config?.googleMaps,
          apiKey: googleKey,
        },
      },
    },
  };
};
