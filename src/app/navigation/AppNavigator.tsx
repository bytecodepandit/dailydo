import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
// Import your screens
import ForgetPasswordScreen from '@modules/auth/screens/ForgetPassword';
import LoginScreen from '@modules/auth/screens/Login';
import RegistrationScreen from '@modules/auth/screens/Registration';
import TodoDetailsScreen from '@modules/todos/screens/TodoDetails'; // Optional loading screen
import TodoListScreen from '@modules/todos/screens/TodoList';

// Import the custom hook
import SettingsScreen from '@/modules/todos/screens/Settings';
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
        initialRouteName={isLoggedIn ? ScreenName.TodoList : ScreenName.Login}>
        {isLoggedIn ? (
          // Authenticated routes
          <>
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
            {/* Add other authenticated screens here */}
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Stack.Screen
              name={ScreenName.Login}
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={ScreenName.Registration}
              component={RegistrationScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={ScreenName.ForgotPassword}
              component={ForgetPasswordScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name={ScreenName.TodoList}
              component={TodoListScreen}
              options={{title: 'My Todos', headerShown: false}}
            />
            <Stack.Screen
              name={ScreenName.TodoDetails}
              component={TodoDetailsScreen}
              options={({route}) => ({
                title: route.params?.isEditing ? 'Edit Todo' : 'Add New Todo',
                headerShown: false,
              })}
            />
            {/* You might have a 'ForgotPassword' screen here */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
