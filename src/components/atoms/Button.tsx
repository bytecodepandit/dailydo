import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {
  Button as PaperButton,
  ButtonProps as PaperButtonProps,
} from 'react-native-paper';

interface ButtonProps extends Omit<PaperButtonProps, 'mode' | 'children'> {
  /**
   * Label of the button.
   */
  children: React.ReactNode;
  /**
   * Type of button.
   * - `contained`: A filled button with raised shadow.
   * - `outlined`: A button with an outline.
   * - `text`: A button with no background or outline.
   * @default 'contained'
   */
  mode?: 'contained' | 'outlined' | 'text';
  /**
   * Function to call when the user presses the button.
   */
  onPress?: () => void;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Styling for the button container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Styling for the button label.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Accessibility label for the button. Used by screen readers.
   */
  accessibilityLabel?: string;
  /**
   * Color of the button (background for contained, text for outlined/text).
   */
  color?: string;
  /**
   * Icon to display on the left side of the button. This can be a string
   * representing the icon name (if using a library like Material Icons)
   * or a React component.
   */
  leftIcon?: string | React.ReactNode;
  /**
   * Icon to display on the right side of the button. This can be a string
   * representing the icon name (if using a library like Material Icons)
   * or a React component.
   */
  rightIcon?: string | React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  mode = 'contained',
  ...rest
}) => (
  <PaperButton mode={mode} {...rest}>
    {children}
  </PaperButton>
);

export default Button;
