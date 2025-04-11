import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput, TextInputProps} from 'react-native-paper';

const TitleInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        style={styles.input}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // Add some horizontal padding around the input
    paddingVertical: 8, // Add some vertical padding
  },
  input: {
    backgroundColor: 'white', // Ensure the input background is white
  },
});

export default TitleInput;
