import {ScreenName} from '@/app/navigation/ScreenName';
import {Button, InputBox, Text} from '@components/atoms';
import {useAuth} from '@contexts/AuthContext';
import {yupResolver} from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  findNodeHandle,
} from 'react-native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {useTheme} from 'react-native-paper';
import * as yup from 'yup';
import AuthSocialButton from '../components/AuthSocialButton';
const {TextColorModule} = NativeModules;

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
  const auth = useAuth();
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
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const viewTag = findNodeHandle(textRef.current);
      TextColorModule.setTextColor(viewTag, 'red'); // Red color
    }
  }, [textRef]);

  const loginUser = async (data: any) => {
    try {
      const response = await auth.login(data.email, data.password);
      if (typeof response === 'object') {
        await AsyncStorage.setItem('authToken', response.password_hash);
        navigation.navigate(ScreenName.TodoList);
      }
    } catch (error) {
      console.log('Error storing data:', error);
    }
  };
  const showInAppNotification = (title, message) => {
    NativeModules.InAppNotification.showNotification(title, message);
  };

  // Example usage:

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
    showInAppNotification('Notification Title', 'Notification Message');
  };

  const handleContinueWithApple = () => {
    console.log('Continue with Apple');
    // Implement Apple sign-in logic
  };

  const handleContinueWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        console.log('Login cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          console.log('Access Token:', data.accessToken.toString());
          // You can now use the access token to fetch user data from the Facebook Graph API.
        }
      }
    } catch (error) {
      console.log('Login failed with error:', error);
    }
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
              disabled={auth.isLoading}
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
              disabled={auth.isLoading}
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
            onPress={handleSubmit(loginUser)}
            disabled={!isValid}
            loading={auth.isLoading}
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
    color: '#2196F3',
    fontWeight: '500',
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
