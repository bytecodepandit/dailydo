import {ScreenName} from '@/app/navigation/ScreenName';
import {useAuth} from '@contexts/AuthContext';
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
  agreeTerms: yup.boolean(),
});

const useRegistration = () => {
  const navigation = useNavigation();
  const {register, isLoading, error: registrationError} = useAuth();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
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
      await register(data.fullName, data.email, data.password);
      navigation.navigate(ScreenName.TodoList);
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
    control,
    setValue,
    handleSubmit,
    isLoading,
    watch,
    registrationError,
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
