module.exports = {
  plugins: [
    ['react-native-worklets-core/plugin', {processNestedWorklets: true}],
    'react-native-reanimated/plugin',
  ],
  presets: ['module:@react-native/babel-preset'],
};
