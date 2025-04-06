import {InputBox} from '@components/atoms';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {Appbar, Button, Text} from 'react-native-paper';
import * as yup from 'yup';
import PasswordRequirementItem from '../../public/components/PasswordRequirementItem';

const passwordRequirements = [
  'At least 8 characters',
  'Include uppercase & lowercase letters',
  'Include at least one number',
  'Include at least one special character',
];

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must include at least one lowercase letter')
    .matches(/[A-Z]/, 'Must include at least one uppercase letter')
    .matches(/\d/, 'Must include at least one number')
    .matches(/[@$!%*?&]/, 'Must include at least one special character'),
  confirmNewPassword: yup
    .string()
    .required('Confirm new password is required')
    .oneOf([yup.ref('newPassword')], 'New passwords must match'),
});

const ChangePasswordScreen = ({navigation}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate on every input change
  });

  const newPasswordValue = watch('newPassword');

  const handleUpdatePassword = (data: any) => {
    console.log('Password data:', data);
    // In a real application, you would send this data to your backend
    // to update the user's password.
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content title="Change Password" />
      </Appbar.Header>

      <View style={styles.content}>
        <InputBox
          name="currentPassword"
          label="Current Password"
          control={control}
          secureTextEntry={true}
          errors={errors}
        />
        <InputBox
          name="newPassword"
          label="New Password"
          control={control}
          secureTextEntry={true}
          errors={errors}
        />
        <InputBox
          name="confirmNewPassword"
          label="Confirm Password"
          control={control}
          secureTextEntry={true}
          errors={errors}
        />

        <Text style={styles.requirementsTitle}>Password Requirements</Text>
        {passwordRequirements.map((requirement, index) => (
          <PasswordRequirementItem
            key={index}
            text={requirement}
            isMet={passwordRegex.test(newPasswordValue)} // Basic check - refine as needed
          />
        ))}

        <Button
          mode="contained"
          onPress={handleSubmit(handleUpdatePassword)}
          style={styles.updateButton}
          disabled={!isValid}>
          Update Password
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  requirementsTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  updateButton: {
    marginTop: 32,
  },
});

export default ChangePasswordScreen;
