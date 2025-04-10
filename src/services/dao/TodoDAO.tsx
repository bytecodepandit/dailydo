import {databaseService} from '@database/databaseServiceOld';
import {Todo} from '@types/database';

class TodoDAO {
  private tableName = 'todos';

  /**
   * Creates a new user in the database.
   * @param email - The user's Full name.
   * @param email - The user's email.
   * @param passwordHash - The hashed password.
   * @returns The newly created User object.
   */
  async createTodoItem(
    title: string,
    description: string,
    hasReminder: string,
    reminderDate: string,
    reminderTime: string,
    completed: boolean,
  ): Promise<Todo> {
    const sql = `INSERT INTO ${this.tableName} (title, description, hasReminder,completed, reminderDate, reminderTime) VALUES (?, ?,?, ?, ?, ?);`;
    try {
      const db = databaseService.getDatabase(); // Ensure DB is open
      const [results] = await db.executeSql(sql, [
        title,
        description,
        hasReminder,
        completed,
        reminderDate,
        reminderTime,
      ]);

      if (results.rowsAffected > 0 && results.insertId) {
        // Fetch the newly created user to return the full object including generated ID and timestamp
        const newTodo = await this.findTodoById(results.insertId);
        if (!newTodo) {
          throw new Error('Failed to retrieve newly created user.');
        }
        console.log(
          `[DB] User created successfully: ${title}, ID: ${newTodo.user_id}`,
        );
        return newTodo;
      } else {
        throw new Error(
          'User creation failed, no rows affected or insertId missing.',
        );
      }
    } catch (error: any) {
      console.error(`[DB] Error creating user ${title}:`, error);
      // Check for unique constraint violation (specific error code might vary)
      if (
        error &&
        error.message &&
        typeof error.message === 'string' &&
        error.message.includes('UNIQUE constraint failed')
      ) {
        throw new Error('Email already exists.');
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Finds a user by their ID.
   * @param userId - The ID of the user.
   * @returns The User object if found, otherwise null.
   */
  async findTodoById(todo_id: number): Promise<Todo | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE todo_id = ? LIMIT 1;`;
    try {
      const db = databaseService.getDatabase();
      const [results] = await db.executeSql(sql, [todo_id]);

      if (results.rows.length > 0) {
        const rawUser = results.rows.item(0);
        return rawUser as Todo; // Assuming column names match interface keys
      } else {
        return null;
      }
    } catch (error) {
      console.error(`[DB] Error finding user by ID ${todo_id}:`, error);
      throw error;
    }
  }

  // --- Add other necessary methods later ---
  // e.g., updateUser, deleteUser
}

// Export a singleton instance
export const todoDAO = new TodoDAO();
