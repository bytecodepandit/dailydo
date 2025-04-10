import {Platform} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

// Enable promise-based operations
SQLite.enablePromise(true);

const DATABASE_NAME = 'finapp.db';
const MAX_RETRIES = 5;
const RETRY_DELAY = 1500;

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private retryCount = 0;
  private isInitializing = false;
  private tablesInitialized = false;

  // --- Connection Management ---

  async open(): Promise<SQLite.SQLiteDatabase> {
    if (this.db && this.tablesInitialized) {
      console.log('[DB] Database already open and tables initialized.');
      return this.db;
    }

    if (this.isInitializing) {
      console.log('[DB] Database opening already in progress. Waiting...');
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!this.isInitializing) {
            clearInterval(checkInterval);
            if (this.db && this.tablesInitialized) {
              resolve(this.db);
            } else {
              reject(new Error('[DB] Database initialization failed.'));
            }
          }
        }, 100);
      });
    }

    this.isInitializing = true;
    this.retryCount = 0;

    try {
      console.log('[DB] Opening database connection...');
      // Close any existing connection first
      if (this.db) {
        try {
          await this.db.close();
          this.db = null;
        } catch (closeError) {
          console.warn('[DB] Error closing existing database:', closeError);
          // Continue anyway
        }
      }
      // Open new connection
      this.db = await this.openWithRetry();
      console.log('[DB] Database connection OPEN');

      // Force schema creation
      await this.initializeSchema();
      this.tablesInitialized = true;
      console.log('[DB] All tables initialized successfully');

      this.isInitializing = false;
      return this.db;
    } catch (error) {
      this.isInitializing = false;
      this.tablesInitialized = false;
      console.error('[DB] CRITICAL ERROR opening database:', error);

      // Attempt recovery
      if (this.retryCount < MAX_RETRIES) {
        console.log(
          `[DB] Will retry opening database (attempt ${
            this.retryCount + 1
          }/${MAX_RETRIES})...`,
        );
        return this.open(); // Recursive retry
      }

      throw new Error(
        `[DB] Failed to open database after ${MAX_RETRIES} attempts: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private async openWithRetry(): Promise<SQLite.SQLiteDatabase> {
    try {
      console.log(
        `[DB] Attempt ${this.retryCount + 1}/${MAX_RETRIES} to open database`,
      );

      // Delete any existing database first
      if (Platform.OS === 'android' && this.retryCount > 0) {
        console.log(
          '[DB] Attempting to delete existing database file on Android...',
        );
        try {
          await SQLite.deleteDatabase({
            name: DATABASE_NAME,
            location: 'default',
          });
          console.log('[DB] Existing database deleted successfully');
        } catch (deleteError) {
          console.warn(
            '[DB] Error deleting database (may not exist yet):',
            deleteError,
          );
          // Continue anyway
        }
      }

      const dbOptions = {
        name: DATABASE_NAME,
        location: 'default',
        createFromLocation: 0,
      };

      console.log(
        '[DB] Opening database with options:',
        JSON.stringify(dbOptions),
      );

      // For Android, use specific options
      if (Platform.OS === 'android') {
        (dbOptions as any).androidDatabaseProvider = 'system';
      }

      return await SQLite.openDatabase(dbOptions);
    } catch (error) {
      this.retryCount++;
      console.error(
        `[DB] Error details for attempt ${this.retryCount}:`,
        error,
      );

      if (this.retryCount <= MAX_RETRIES) {
        console.log(
          `[DB] Database open attempt ${this.retryCount} failed, retrying in ${RETRY_DELAY}ms...`,
        );
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.openWithRetry(); // Recursive retry
      }

      console.error('[DB] All retry attempts failed. Last error:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (!this.db) {
      console.log('[DB] Database not open, cannot close.');
      return;
    }

    try {
      console.log('[DB] Closing database...');
      await this.db.close();
      this.db = null;
      this.tablesInitialized = false;
      console.log('[DB] Database CLOSED');
    } catch (error) {
      console.error('[DB] Error closing database:', error);
      throw error;
    }
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('[DB] Database is not open. Call open() first.');
    }
    if (!this.tablesInitialized) {
      throw new Error(
        '[DB] Database tables are not initialized. Call open() first.',
      );
    }
    return this.db;
  }

  // --- Schema Initialization ---

  private async executeSql(
    sql: string,
    params: any[] = [],
  ): Promise<SQLite.ResultSet> {
    if (!this.db) {
      throw new Error('[DB] Database is not open. Call open() first.');
    }

    console.log(
      `[DB] Executing SQL: ${sql.substring(0, 100)}...`,
      params.length ? params : '',
    );
    try {
      const [results] = await this.db.executeSql(sql, params);
      console.log(`[DB] SQL Success: ${sql.substring(0, 100)}...`);
      return results;
    } catch (error) {
      console.error(
        `[DB] SQL Error executing: ${sql.substring(0, 100)}...`,
        error,
      );
      throw error;
    }
  }

  private async initializeSchema(): Promise<void> {
    console.log('[DB] Initializing schema...');
    if (!this.db) {
      throw new Error('[DB] Database is not open. Call open() first.');
    }

    try {
      // Enable foreign keys
      await this.db.executeSql('PRAGMA foreign_keys = ON;');
      console.log('[DB] Foreign keys enabled.');

      // Check database integrity
      const integrityCheck = await this.db.executeSql(
        'PRAGMA integrity_check;',
      );
      console.log(
        '[DB] Database integrity:',
        integrityCheck[0].rows.item(0).integrity_check,
      );

      // Create all tables in a single transaction
      await this.db.transaction(async (tx: SQLite.Transaction) => {
        console.log('[DB] Starting schema creation transaction...');

        // Users Table
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log("[DB] Table 'users' created.");

        // Settings Table
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS todos (
            todo_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            description TEXT,
            hasReminder INTEGER DEFAULT 0,
            completed BOOLEAN,
            reminderDate TEXT,
            reminderTime TEXT,
            UNIQUE (user_id, title),
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
          );
        `);
        console.log("[DB] Table 'settings' created.");

        // Accounts Table
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS accounts (
            account_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('Checking', 'Savings', 'Credit Card', 'Investment', 'Cash', 'Other')),
            balance REAL NOT NULL DEFAULT 0.0,
            currency TEXT NOT NULL DEFAULT 'USD',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
          );
        `);
        console.log("[DB] Table 'accounts' created.");

        // Transactions Table
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            description TEXT,
            amount REAL NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            category TEXT,
            date TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
          );
        `);
        console.log("[DB] Table 'transactions' created.");

        // Budgets Table (for future use)
        await tx.executeSql(`
          CREATE TABLE IF NOT EXISTS budgets (
            budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            period TEXT NOT NULL CHECK(period IN ('weekly', 'monthly', 'yearly', 'custom')),
            start_date TEXT NOT NULL,
            end_date TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
          );
        `);
        console.log("[DB] Table 'budgets' created.");

        // --- Indexes ---
        console.log('[DB] Creating indexes...');
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_settings_user_key ON settings(user_id, key);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);',
        );
        await tx.executeSql(
          'CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);',
        );
        console.log('[DB] Indexes created.');
      });

      // Verify tables exist
      await this.verifyTables();

      console.log('[DB] Schema initialized successfully.');
      this.tablesInitialized = true;
    } catch (error) {
      console.error('[DB] CRITICAL ERROR initializing schema:', error);
      this.tablesInitialized = false;
      throw new Error(
        `Schema initialization failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private async verifyTables(): Promise<boolean> {
    if (!this.db) {
      throw new Error('[DB] Database is not open.');
    }

    const requiredTables = [
      'users',
      'settings',
      'accounts',
      'transactions',
      'budgets',
    ];
    const [results] = await this.db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_%';",
    );

    const existingTables: string[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      existingTables.push(results.rows.item(i).name);
    }

    console.log('[DB] Existing tables:', existingTables);

    const missingTables = requiredTables.filter(
      table => !existingTables.includes(table),
    );
    if (missingTables.length > 0) {
      console.error('[DB] Missing tables:', missingTables);
      return false;
    }

    return true;
  }

  // --- Diagnostic Methods ---

  async getDatabaseInfo(): Promise<object> {
    try {
      if (!this.db) {
        return {
          isOpen: false,
          tablesInitialized: false,
          databaseName: DATABASE_NAME,
          error: 'Database not open',
        };
      }

      const tables = await this.listTables();
      const counts: Record<string, number> = {};

      for (const table of tables) {
        try {
          const [countResult] = await this.db.executeSql(
            `SELECT COUNT(*) as count FROM ${table}`,
          );
          counts[table] = countResult.rows.item(0).count;
        } catch (error) {
          console.error(`[DB] Error counting records in ${table}:`, error);
          counts[table] = -1; // Indicate error
        }
      }

      // Get database file size
      let fileSize = 'Unknown';
      try {
        if (Platform.OS === 'android') {
          const [sizeResult] = await this.db.executeSql(
            'PRAGMA page_count, page_size;',
          );
          const pageCount = sizeResult.rows.item(0).page_count;
          const pageSize = sizeResult.rows.item(0).page_size;
          fileSize = `${((pageCount * pageSize) / 1024).toFixed(2)} KB`;
        }
      } catch (error) {
        console.error('[DB] Error getting database file size:', error);
      }

      return {
        isOpen: true,
        tablesInitialized: this.tablesInitialized,
        databaseName: DATABASE_NAME,
        location: Platform.OS === 'android' ? 'system' : 'default',
        tables,
        recordCounts: counts,
        fileSize,
      };
    } catch (error) {
      console.error('[DB] Error getting database info:', error);
      return {
        isOpen: !!this.db,
        tablesInitialized: this.tablesInitialized,
        databaseName: DATABASE_NAME,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async listTables(): Promise<string[]> {
    try {
      if (!this.db) {
        throw new Error('[DB] Database is not open.');
      }

      const [results] = await this.db.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_%';",
      );

      const tables: string[] = [];
      for (let i = 0; i < results.rows.length; i++) {
        tables.push(results.rows.item(i).name);
      }

      return tables;
    } catch (error) {
      console.error('[DB] Error listing tables:', error);
      return [];
    }
  }

  // --- Reset Database (for testing/recovery) ---

  async resetDatabase(): Promise<void> {
    try {
      console.log('[DB] Attempting to reset database...');

      // Close existing connection
      if (this.db) {
        await this.close();
      }

      // Delete database
      await SQLite.deleteDatabase({name: DATABASE_NAME, location: 'default'});
      console.log('[DB] Database deleted successfully');

      // Reinitialize
      this.tablesInitialized = false;
      await this.open();

      console.log('[DB] Database reset successfully');
    } catch (error) {
      console.error('[DB] Error resetting database:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();
