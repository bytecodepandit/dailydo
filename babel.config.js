module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-react-jsx'], // This might be present
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
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
          '@navigation': './src/app/navigation',
          '@theme': './src/app/theme',
          '@assets': './src/assets',
          '@components': './src/components',
          '@constants': './src/constants',
          '@config': './src/config',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@models': './src/models',
          '@modules': './src/modules',
          '@services': './src/services',
          '@store': './src/store',
          '@utils': './src/utils',
          '@types': './src/types',
          // Add more aliases as needed
        },
      },
    ],
  ],
};
