const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// react-native-maps est natif : en version web (expo start --web) on le remplace par un stub.
const webStubs = {
  "react-native-maps": path.resolve(__dirname, "web-stubs/react-native-maps.tsx"),
};
const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && webStubs[moduleName]) {
    return { type: "sourceFile", filePath: webStubs[moduleName] };
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
