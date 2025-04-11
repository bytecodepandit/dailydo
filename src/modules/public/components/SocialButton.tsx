import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AuthSocialButton from './AuthSocialButton';

const SocialButton = () => {
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
    <View style={styles.socialLoginContainer}>
      <View style={styles.dividerLine} />
      <Text style={styles.orText}>Or continue with</Text>
      <View style={styles.socialButtons}>
        <AuthSocialButton icon="google" onPress={handleContinueWithGoogle} />
        <AuthSocialButton icon="apple" onPress={handleContinueWithApple} />
        <AuthSocialButton
          icon="facebook"
          onPress={handleContinueWithFacebook}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },

  socialLoginContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  dividerLine: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '80%',
    marginBottom: 18,
  },
  orText: {
    color: '#777',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default SocialButton;
