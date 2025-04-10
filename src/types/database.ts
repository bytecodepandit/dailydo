export interface User {
  user_id: number;
  email: string;
  password_hash: string;
  created_at: string; // ISO 8601 string
}

export interface Todo {
  user_id: number;
  todo_id: string;
  title: string;
  description: string;
  reminderDate: string;
  reminderTime: string;
  completed: boolean;
}
