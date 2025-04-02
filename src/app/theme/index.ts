// theme.ts
import {DefaultTheme} from 'react-native-paper';
import colors from './colors';
import fonts from './fonts';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...colors,
  },
  fonts: {
    ...DefaultTheme.fonts,
    ...fonts,
  },
};

export default theme;
