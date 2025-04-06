import React from 'react';
import {
  Checkbox as PaperCheckbox,
  CheckboxProps as PaperCheckboxProps,
} from 'react-native-paper';

interface CheckboxProps extends PaperCheckboxProps {
  // You can add your own specific props here if needed
  // For example, if you want to enforce a specific style:
  // customStyle?: StyleProp<ViewStyle>;
}

const Checkbox: React.FC<CheckboxProps> = props => <PaperCheckbox {...props} />;

export default Checkbox;
