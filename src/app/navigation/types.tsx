export type RootStackParamList = {
  TodoList: undefined;
  Settings: undefined;
  TodoDetails: {todoId?: string; isEditing?: boolean} | undefined;
  Login: undefined;
  Registration: undefined;
  ForgotPassword: undefined;
  // You can add other screen parameters here if your other screens accept any
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  import('@react-navigation/native-stack').NativeStackScreenProps<
    RootStackParamList,
    Screen
  >;
