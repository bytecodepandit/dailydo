import SQLite from 'react-native-sqlite-storage';

export const createTables = async (tx: SQLite.Transaction): Promise<void> => {
  console.log('[DB Schema] Starting schema creation transaction...');

  // Users Table
  await tx.executeSql(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("[DB Schema] Table 'users' created.");

  // Settings Table
  await tx.executeSql(`
    CREATE TABLE IF NOT EXISTS settings (
      setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      UNIQUE (user_id, key),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);
  console.log("[DB Schema] Table 'settings' created.");

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
  console.log("[DB Schema] Table 'accounts' created.");

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
  console.log("[DB Schema] Table 'transactions' created.");

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
  console.log("[DB Schema] Table 'budgets' created.");
};

export const createIndexes = async (tx: SQLite.Transaction): Promise<void> => {
  console.log('[DB Schema] Creating indexes...');
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
  console.log('[DB Schema] Indexes created.');
};

export const verifyRequiredTables = async (
  db: SQLite.SQLiteDatabase,
): Promise<boolean> => {
  const requiredTables = [
    'users',
    'settings',
    'accounts',
    'transactions',
    'budgets',
  ];
  const [results] = await db.executeSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_%';",
  );

  const existingTables: string[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    existingTables.push(results.rows.item(i).name);
  }

  console.log('[DB Schema] Existing tables:', existingTables);

  const missingTables = requiredTables.filter(
    table => !existingTables.includes(table),
  );
  if (missingTables.length > 0) {
    console.error('[DB Schema] Missing tables:', missingTables);
    return false;
  }

  return true;
};
