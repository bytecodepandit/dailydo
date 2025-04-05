import {ScreenName} from '@/app/navigation/ScreenName';
import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert} from 'react-native';
import * as yup from 'yup';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const validationSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email address is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
  agreeTerms: yup
    .boolean()
    .oneOf([true], 'You must agree to the terms and privacy policy'),
});

const useRegistration = () => {
  const navigation = useNavigation();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const {
    value,
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const handleCreateAccount = async (data: FormData) => {
    if (!isValid) {
      return;
    }
    setIsCreatingAccount(true);
    try {
      // Simulate API call
      console.log('Registration Data:', data);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Replace with your actual API call
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate(ScreenName.Login);
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate(ScreenName.Login);
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Sign up with Google', 'Implementation in progress.');
  };

  const handleAppleSignUp = () => {
    Alert.alert('Sign up with Apple', 'Implementation in progress.');
  };

  const handleFacebookSignUp = () => {
    Alert.alert('Sign up with Facebook', 'Implementation in progress.');
  };

  return {
    value,
    control,
    setValue,
    handleSubmit,
    errors,
    isCreatingAccount,
    handleCreateAccount,
    handleLoginNavigation,
    handleGoogleSignUp,
    handleAppleSignUp,
    handleFacebookSignUp,
  };
};

export default useRegistration;
