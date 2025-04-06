import React from 'react';
import {
  TextInput as PaperTextInput,
  TextInputProps as PaperTextInputProps,
} from 'react-native-paper';

interface TextInputProps extends PaperTextInputProps {
  // You can add your own specific props here if needed
  // For example, a custom error message type:
  // errorMessage?: string;
}

const TextInput: React.FC<TextInputProps> = props => (
  <PaperTextInput {...props} />
);

export type {TextInputProps};
export default TextInput;
