import React from 'react';
import {
  TextProps as NativeTextProps,
  Text as PaperText,
  StyleProp,
  TextStyle,
} from 'react-native';

type Variant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

interface TextProps extends NativeTextProps {
  /**
   * The content to display within the Text component.
   */
  children: React.ReactNode;
  /**
   * Semantic variant of the text, which applies predefined styles based on the theme.
   */
  variant?: Variant;
  /**
   * Style overrides for the Text component.
   */
  style?: StyleProp<TextStyle>;
}

const Text: React.FC<TextProps> = ({children, variant, style, ...rest}) => {
  return (
    <PaperText style={style} variant={variant} {...rest}>
      {children}
    </PaperText>
  );
};

export type {TextProps, Variant};
export default Text;
