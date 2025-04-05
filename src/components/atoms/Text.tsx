import React from 'react';
import {Text as PaperText} from 'react-native';

const Text = ({children, variant, style, ...rest}) => (
  <PaperText style={style} {...rest}>
    {children}
  </PaperText>
);

export default Text;
