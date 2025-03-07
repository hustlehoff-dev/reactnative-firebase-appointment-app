// Import the necessary modules
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Get the default Expo Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Add "cjs" to the source extensions
defaultConfig.resolver.sourceExts.push("cjs");

// Now, withNativeWind will also modify the default config for CSS support
module.exports = withNativeWind(defaultConfig, { input: "./global.css" });
