import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {
  IconButton as PaperIconButton,
  IconButtonProps as PaperIconButtonProps,
} from 'react-native-paper';

interface IconButtonProps extends PaperIconButtonProps {
  // You can add your own specific props here if needed
  // For example, a custom size constraint:
  // customSize?: number;
  style?: StyleProp<ViewStyle>; // Good practice to explicitly include style
}

const IconButton: React.FC<IconButtonProps> = props => (
  <PaperIconButton {...props} />
);

export type {IconButtonProps};
export default IconButton;
