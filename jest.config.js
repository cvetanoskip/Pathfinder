module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@maplibre/.*))",
  ],
  moduleNameMapper: {
    "^@expo/vector-icons$": "<rootDir>/__mocks__/@expo/vector-icons.js",
    "^expo-font$": "<rootDir>/__mocks__/expo-font.js",
    "^expo-asset$": "<rootDir>/__mocks__/expo-asset.js",
    "^@react-native-async-storage/async-storage$":
      "<rootDir>/__mocks__/AsyncStorageMock.js",
    "react-native-worklets/plugin":
      "<rootDir>/__mocks__/react-native-worklets-plugin.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};
