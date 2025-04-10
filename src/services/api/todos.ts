import {todoDAO} from '../dao/TodoDAO';

export const createTodoItem = async ({
  title,
  description,
  hasReminder,
  reminderDate,
  reminderTime,
}: any): Promise<boolean> => {
  console.log('AuthProvider: login attempt');
  try {
    await todoDAO.createTodoItem(
      title,
      description,
      hasReminder,
      reminderDate,
      reminderTime,
      false,
    );

    console.log(`AuthProvider: login successful for ${title}`);
    return true;
  } catch (e: any) {
    console.error('AuthProvider: login failed', e);
    return false;
  }
};
