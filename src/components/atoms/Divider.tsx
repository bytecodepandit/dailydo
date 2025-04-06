import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {
  Divider as PaperDivider,
  DividerProps as PaperDividerProps,
} from 'react-native-paper';

interface DividerProps extends PaperDividerProps {
  // You can add your own specific props here if needed
  // For example, if you want to enforce a specific thickness:
  // customThickness?: number;
  style?: StyleProp<ViewStyle>; // It's good to explicitly include style
}

const Divider: React.FC<DividerProps> = props => <PaperDivider {...props} />;

export type {DividerProps};
export default Divider;
