import {InputBox} from '@components/atoms';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
import {Appbar, Button, Checkbox, Text, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import SocialButton from '../components/SocialButton';
import useRegistration from '../hooks/useRegistration';

const RegistrationScreen: React.FC = () => {
  const theme = useTheme();
  const {
    control,
    setValue,
    handleSubmit,
    errors,
    isCreatingAccount,
    handleCreateAccount,
    handleLoginNavigation,
    isLoading,
  } = useRegistration();

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container]}>
        <Appbar.Header style={styles.appBar}>
          <View style={styles.headerContent}>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content
              title="Create Account"
              titleStyle={styles.appBarTitle}
            />
            {/* Placeholder for balance on iOS */}
            {Platform.OS === 'ios' && <View style={{width: 60}} />}
          </View>
        </Appbar.Header>
        <View style={styles.formWrapper}>
          <InputBox
            control={control}
            name="fullName"
            label="Full Name"
            disabled={isLoading}
            errors={errors}
          />
          <InputBox
            control={control}
            name="email"
            label="Email Address"
            disabled={isLoading}
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
            secureTextEntry
            disabled={isLoading}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            errors={errors}
          />
          <InputBox
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            disabled={isLoading}
            secureTextEntry
            rules={{
              required: 'Confirm password is required',
              validate: (value: any) =>
                value === control._formValues.password ||
                'Passwords must match',
            }}
            errors={errors}
          />

          <View style={styles.termsContainer}>
            <Checkbox
              status={control._formValues.agreeTerms ? 'checked' : 'unchecked'}
              onPress={() => {
                console.log('agreeTerms', control._formValues.agreeTerms);
                setValue('agreeTerms', !control._formValues.agreeTerms);
              }}
            />
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={{color: theme.colors.primary}}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={{color: theme.colors.primary}}>Privacy Policy</Text>
            </Text>
          </View>
          {errors.agreeTerms && (
            <Text style={styles.errorText}>{errors.agreeTerms.message}</Text>
          )}

          <Button
            mode="contained"
            style={styles.createButton}
            onPress={handleSubmit(handleCreateAccount)}
            loading={isLoading}
            disabled={isCreatingAccount || !control._formState.isValid}>
            Create Account
          </Button>

          <SocialButton />
        </View>
        <Text style={styles.loginText}>
          Already have an account ?{' '}
          <Text
            style={{color: theme.colors.primary, fontWeight: 'bold'}}
            onPress={handleLoginNavigation}>
            Log in
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2', // Optional background color
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  appBar: {
    backgroundColor: 'transparent', // Remove background color
    elevation: 0, // Remove shadow (optional)
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content horizontally within headerContent
  },
  appBarTitle: {
    textAlign: 'center',
    flex: 1, // Allow title to take up available space
    fontWeight: 'bold',
    marginTop: 15,
  },
  formWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '100%', // Adjust width as needed
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    marginLeft: 8,
    fontSize: 12,
  },
  createButton: {
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 8,
  },
  orText: {
    textAlign: 'center',
    marginBottom: 16,
    color: 'gray',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 24,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
});

export default RegistrationScreen;
