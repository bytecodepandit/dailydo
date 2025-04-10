import {databaseService} from '@database/databaseServiceOld';
import {User} from '@types/database';

class UserDAO {
  private tableName = 'users';

  /**
   * Creates a new user in the database.
   * @param email - The user's Full name.
   * @param email - The user's email.
   * @param passwordHash - The hashed password.
   * @returns The newly created User object.
   */
  async createUser(
    fullName: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const sql = `INSERT INTO ${this.tableName} (fullName, email, password_hash) VALUES (?, ?, ?);`;
    try {
      const db = databaseService.getDatabase(); // Ensure DB is open
      const [results] = await db.executeSql(sql, [
        fullName,
        email,
        passwordHash,
      ]);

      if (results.rowsAffected > 0 && results.insertId) {
        // Fetch the newly created user to return the full object including generated ID and timestamp
        const newUser = await this.findUserById(results.insertId);
        if (!newUser) {
          throw new Error('Failed to retrieve newly created user.');
        }
        console.log(
          `[DB] User created successfully: ${email}, ID: ${newUser.user_id}`,
        );
        return newUser;
      } else {
        throw new Error(
          'User creation failed, no rows affected or insertId missing.',
        );
      }
    } catch (error: any) {
      console.error(`[DB] Error creating user ${email}:`, error);
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
   * Finds a user by their email address.
   * @param email - The email to search for.
   * @returns The User object if found, otherwise null.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE email = ? LIMIT 1;`;
    try {
      const db = databaseService.getDatabase();
      const [results] = await db.executeSql(sql, [email]);

      if (results.rows.length > 0) {
        const rawUser = results.rows.item(0);
        return rawUser as User; // Assuming column names match interface keys
      } else {
        return null;
      }
    } catch (error) {
      console.error(`[DB] Error finding user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Finds a user by their ID.
   * @param userId - The ID of the user.
   * @returns The User object if found, otherwise null.
   */
  async findUserById(userId: number): Promise<User | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ? LIMIT 1;`;
    try {
      const db = databaseService.getDatabase();
      const [results] = await db.executeSql(sql, [userId]);

      if (results.rows.length > 0) {
        const rawUser = results.rows.item(0);
        return rawUser as User; // Assuming column names match interface keys
      } else {
        return null;
      }
    } catch (error) {
      console.error(`[DB] Error finding user by ID ${userId}:`, error);
      throw error;
    }
  }

  // --- Add other necessary methods later ---
  // e.g., updateUser, deleteUser
}

// Export a singleton instance
export const userDAO = new UserDAO();
