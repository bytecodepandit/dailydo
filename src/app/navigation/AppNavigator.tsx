import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
// Import your screens
import TodoDetailsScreen from '@/modules/private/screens/TodoDetails'; // Optional loading screen
import TodoListScreen from '@/modules/private/screens/TodoList';
import ForgetPasswordScreen from '@/modules/public/screens/ForgetPassword';
import LoginScreen from '@/modules/public/screens/Login';
import RegistrationScreen from '@/modules/public/screens/Registration';

// Import the custom hook
import ChangePasswordScreen from '@/modules/private/screens/ChangePassword';
import PayPalPaymentScreen from '@/modules/private/screens/PayPalPayment';
import SettingsScreen from '@/modules/private/screens/Settings';
import UserProfileScreen from '@/modules/private/screens/UserProfile';
import useAuth from '@hooks/useAuth';
import {ActivityIndicator} from 'react-native-paper';
import {ScreenName} from './ScreenName';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const {isLoggedIn, loading} = useAuth();

  if (loading) {
    return <ActivityIndicator />; // Or a simple ActivityIndicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={!isLoggedIn ? ScreenName.TodoList : ScreenName.Login}>
        <Stack.Screen
          name={ScreenName.TodoList}
          component={TodoListScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ScreenName.Settings}
          component={SettingsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ScreenName.TodoDetails}
          component={TodoDetailsScreen}
          options={({route}) => ({
            title: route.params?.isEditing ? 'Edit Todo' : 'Add New Todo',
            headerShown: false,
          })}
        />
        <Stack.Screen
          name={ScreenName.PaypalPayment}
          component={PayPalPaymentScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ScreenName.ChangePassword}
          component={ChangePasswordScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name={ScreenName.UserProfile}
          component={UserProfileScreen}
          options={() => ({
            headerShown: false,
          })}
        />
        <Stack.Screen
          name={ScreenName.Login}
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ScreenName.Registration}
          component={RegistrationScreen}
          options={{headerShown: false, title: 'Create Account'}}
        />
        <Stack.Screen
          name={ScreenName.ForgotPassword}
          component={ForgetPasswordScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
