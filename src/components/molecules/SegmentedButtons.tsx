import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface SegmentedButtonOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface SegmentedButtonsProps {
  options: SegmentedButtonOption[];
  onValueChange: (value: string | number) => void;
  initialValue?: string | number;
}

const SegmentedButtons: React.FC<SegmentedButtonsProps> = ({
  options,
  onValueChange,
  initialValue,
}) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handlePress = (value: string | number) => {
    setSelectedValue(value);
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.button,
            selectedValue === option.value && styles.selectedButton,
          ]}
          onPress={() => handlePress(option.value)}
          disabled={option?.disabled}>
          <Text
            style={[
              styles.buttonText,
              selectedValue === option.value && styles.selectedButtonText,
              option?.disabled && styles.disabledButtonText,
            ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 0,
    overflow: 'hidden', // To clip rounded corners
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  selectedButtonText: {
    color: '#6B7280',
  },
  disabledButtonText: {
    color: '#ccc',
  },
});

export default SegmentedButtons;
