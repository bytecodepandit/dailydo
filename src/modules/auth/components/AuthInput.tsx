import React, {useState} from 'react';
import {Control, Controller, FieldErrors} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';

interface AuthInputProps {
  control: Control<any>;
  name: string;
  label: string;
  rules?: any;
  secureTextEntry?: boolean;
  errors: FieldErrors;
}

const AuthInput: React.FC<AuthInputProps> = ({
  control,
  name,
  label,
  rules,
  secureTextEntry,
  errors,
}) => {
  const hasError = !!errors[name];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
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
              style={styles.input}
              placeholderTextColor="#A9A9A9"
              placeholder={`Enter your ${label.toLowerCase()}`}
              error={hasError}
              right={
                secureTextEntry ? (
                  <TextInput.Icon
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    onPress={togglePasswordVisibility}
                    forceTextInputFocus={false}
                  />
                ) : null
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
  },
});

export default AuthInput;
