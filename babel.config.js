module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'module:metro-react-native-babel-preset',
  ],
  plugins: [
    ['@babel/plugin-transform-react-jsx'], // This might be present
    ['@babel/plugin-transform-react-jsx-self'], // REMOVE THIS LINE
    ['@babel/plugin-transform-react-jsx-source'], // REMOVE THIS LINE
    [
      'react-native-dotenv',
      {
        moduleName: '@env',
        path: './src/config/.env',
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'], // Specify the root directory for absolute imports
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@navigation': './src/navigation',
          '@theme': './src/app/theme',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@config': './src/config',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@modules': './src/modules',
          '@services': './src/services',
          '@utils': './src/utils',
          '@types': './src/types',
          '@styles': './src/styles',
          // Add more aliases as needed
        },
      },
    ],
  ],
};
