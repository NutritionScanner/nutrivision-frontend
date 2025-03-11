const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
//   config.resolver.extraNodeModules = {
//     '@env': require.resolve('react-native-dotenv'),
//   };
  return config;
})();
