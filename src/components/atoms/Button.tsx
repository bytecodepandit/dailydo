import React from 'react';
import {Button as PaperButton} from 'react-native-paper';

const Button = ({children, mode = 'contained', ...rest}) => (
  <PaperButton mode={mode} {...rest}>
    {children}
  </PaperButton>
);

export default Button;
