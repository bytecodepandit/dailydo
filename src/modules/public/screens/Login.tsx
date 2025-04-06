import {ScreenName} from '@/app/navigation/ScreenName';
import {Button, InputBox, Text} from '@components/atoms';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {useForm} from 'react-hook-form';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import * as yup from 'yup';
import AuthSocialButton from '../components/AuthSocialButton';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginUser = async () => {
    try {
      await AsyncStorage.setItem(
        'authToken',
        'adsjfbasd6343647364376sjbajsbcajhsdrwy36434',
      );
      console.log('Data stored successfully');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const handleSignIn = async data => {
    // Implement your sign-in logic here using data.email and data.password
    console.log('Signing in with:', data.email, data.password);
    // After successful sign-in, navigate to the main app screen
    await loginUser();
    navigation.navigate(ScreenName.TodoList);
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password screen
    console.log('Forgot password pressed');
    navigation.navigate(ScreenName.ForgotPassword);
  };

  const handleSignUp = () => {
    // Navigate to the sign-up screen
    console.log('Sign up pressed');
    navigation.navigate(ScreenName.Registration);
  };

  const handleContinueWithGoogle = () => {
    console.log('Continue with Google');
    // Implement Google sign-in logic
  };

  const handleContinueWithApple = () => {
    console.log('Continue with Apple');
    // Implement Apple sign-in logic
  };

  const handleContinueWithFacebook = () => {
    console.log('Continue with Facebook');
    // Implement Facebook sign-in logic
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Image
                source={require('@assets/images/icons/logo.png')}
                resizeMode="contain"
                style={styles.logo}
              />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <InputBox
              control={control}
              name="email"
              label="Email Address"
              placeholder="Enter your Email"
              rules={{
                required: 'Email address is required',
                pattern: /^\S+@\S+$/i,
              }}
              errors={errors}
            />
            <InputBox
              control={control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              }}
              errors={errors}
            />
            <Text onPress={handleForgotPassword} style={styles.forgotPassword}>
              Forgot Password?
            </Text>
          </View>

          {/* Sign In Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(handleSignIn)}
            disabled={!isValid}
            style={styles.signInButton}>
            Sign In
          </Button>

          {/* Social Login */}
          <View style={styles.socialLoginContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>Or continue with</Text>
            <View style={styles.socialButtons}>
              <AuthSocialButton
                icon="google"
                onPress={handleContinueWithGoogle}
              />
              <AuthSocialButton
                icon="apple"
                onPress={handleContinueWithApple}
              />
              <AuthSocialButton
                icon="facebook"
                onPress={handleContinueWithFacebook}
              />
            </View>
          </View>

          {/* Sign Up Navigation */}
          <View style={styles.signUpContainer}>
            <Text>Don't have an account? </Text>
            <Text
              onPress={handleSignUp}
              style={styles.signUpLink}
              color={colors.primary}>
              Sign up
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'yellow',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    marginBottom: 8,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subtitle: {
    color: '#777',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    color: '#3f51b5', // Example primary color
  },
  signInButton: {
    marginBottom: 24,
  },
  socialLoginContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  dividerLine: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '80%',
    marginBottom: 16,
  },
  orText: {
    color: '#777',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;
