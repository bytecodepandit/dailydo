import {Button, IconButton, InputBox, Text} from '@components/atoms';
import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {useForm} from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, useTheme} from 'react-native-paper';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

const ForgotPasswordScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const handleSendResetLink = data => {
    // Implement your logic to send a password reset link to the provided email
    console.log('Sending reset link to:', data.email);
    // After sending the link (potentially with a success message), you might navigate back or to a confirmation screen
    // navigation.goBack();
  };

  const handleGoBack = () => {
    navigation.navigate.goBack();
  };

  const handleContactSupport = () => {
    // Implement logic to navigate to a support contact screen or open a support link
    console.log('Contacting support');
    // Linking.openURL('mailto:support@example.com');
  };

  const handleLogin = () => {
    navigation.navigate('Login'); // Navigate back to the login screen
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Back Button */}
          <IconButton
            icon="arrow-left"
            size={30}
            onPress={handleGoBack}
            style={styles.backButton}
          />

          {/* Title and Icon */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Forgot Password</Text>
            <View style={styles.iconContainer}>
              <Avatar.Icon
                size={80}
                icon="lock-outline"
                color={colors.primary}
                backgroundColor="#f3f3f3"
              />
            </View>
            <Text style={styles.description}>
              Enter your email address and we'll send you a link to reset your
              password
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <InputBox
              control={control}
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              rules={{
                required: 'Email address is required',
                pattern: /^\S+@\S+$/i,
              }}
              errors={errors}
            />
          </View>

          {/* Send Reset Link Button */}
          <Button
            mode="contained"
            onPress={handleSubmit(handleSendResetLink)}
            style={styles.resetButton}>
            Send Reset Link
          </Button>

          {/* Help and Login Navigation */}
          <View style={styles.navigationContainer}>
            <Text style={styles.helpText}>Need help?</Text>
            <Text
              onPress={handleContactSupport}
              style={styles.supportLink}
              color={colors.primary}>
              Contact Support
            </Text>
            <View style={styles.rememberPassword}>
              <Text>Remember your password? </Text>
              <Text
                onPress={handleLogin}
                style={styles.loginLink}
                color={colors.primary}>
                Login
              </Text>
            </View>
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
  },
  innerContainer: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60, // Adjust as needed
    marginBottom: 32,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  iconContainer: {
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    color: '#555',
  },
  input: {
    marginBottom: 16,
  },
  resetButton: {
    marginBottom: 24,
  },
  navigationContainer: {
    alignItems: 'center',
  },
  helpText: {
    color: '#777',
    marginBottom: 8,
  },
  supportLink: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  rememberPassword: {
    flexDirection: 'row',
    marginTop: 16,
  },
  loginLink: {
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
