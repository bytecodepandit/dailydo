import React, {useState} from 'react';
import {Control, Controller, FieldErrors} from 'react-hook-form';
import {StyleProp, StyleSheet, Text, TextStyle, View} from 'react-native';
import {TextInput, TextInputProps} from 'react-native-paper';

interface AuthInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label: string;
  rules?: any;
  secureTextEntry?: boolean;
  errors: FieldErrors;
  containerStyles?: any;
  inputStyle?: StyleProp<TextStyle>;
}

const AuthInput: React.FC<AuthInputProps> = ({
  control,
  name,
  label,
  rules,
  secureTextEntry,
  errors,
  placeholder,
  containerStyles,
  right,
  inputStyle,
}) => {
  const hasError = !!errors[name];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWrapper}>
            <TextInput
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              mode="outlined"
              outlineStyle={styles.inputOutline}
              style={[styles.input, inputStyle]}
              placeholderTextColor="#A9A9A9"
              placeholder={placeholder}
              error={hasError}
              right={
                right ||
                (secureTextEntry ? (
                  <TextInput.Icon
                    icon={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={togglePasswordVisibility}
                    forceTextInputFocus={false}
                    style={styles.iconButton}
                  />
                ) : null)
              }
            />
          </View>
        )}
      />
      {hasError && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputOutline: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 10,
    height: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  iconButton: {
    padding: 8,
    marginTop: 25,
  },
});

export default AuthInput;
