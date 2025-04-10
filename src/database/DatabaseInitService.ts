import {Platform} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {databaseService} from './databaseServiceOld';

// Track initialization state
let isInitialized = false;
let isInitializing = false;
let lastError: Error | null = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Listeners for database state changes
type DatabaseStateListener = (error: Error | null) => void;
const listeners: DatabaseStateListener[] = [];

/**
 * Service to handle database initialization
 */
export const DatabaseInitService = {
  /**
   * Initialize the database with proper error handling
   */
  async initialize(): Promise<void> {
    // Prevent multiple simultaneous initialization attempts
    if (isInitializing) {
      console.log('[DBInit] Initialization already in progress, waiting...');
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!isInitializing) {
            clearInterval(checkInterval);
            if (lastError) {
              reject(lastError);
            } else {
              resolve();
            }
          }
        }, 100);
      });
    }

    // Return immediately if already initialized successfully
    if (isInitialized) {
      console.log('[DBInit] Database already initialized.');
      return;
    }

    try {
      isInitializing = true;
      lastError = null;
      initAttempts++;

      // Notify listeners of initialization start
      this.notifyListeners(null);

      console.log(
        `[DBInit] Starting database initialization (attempt ${initAttempts})...`,
      );

      // If this is a retry and we're on Android, try to delete the database first
      if (initAttempts > 1 && Platform.OS === 'android') {
        try {
          console.log(
            '[DBInit] Attempting to delete existing database file...',
          );
          await SQLite.deleteDatabase({name: 'finapp.db', location: 'default'});
          console.log('[DBInit] Existing database deleted successfully');
        } catch (deleteError) {
          console.warn(
            '[DBInit] Error deleting database (may not exist yet):',
            deleteError,
          );
          // Continue anyway
        }
      }

      try {
        // Open database, ensuring tables are created
        await databaseService.open();

        // Perform diagnostic checks
        const dbInfo = await databaseService.getDatabaseInfo();
        console.log('[DBInit] Database info:', JSON.stringify(dbInfo));

        // Verify tables
        const dbInfoWithTables = dbInfo as {tables?: string[]};
        if (dbInfoWithTables.tables && Array.isArray(dbInfoWithTables.tables)) {
          const requiredTables = [
            'users',
            'settings',
            'accounts',
            'transactions',
            'budgets',
          ];
          const missingTables = requiredTables.filter(
            table => !dbInfoWithTables.tables!.includes(table),
          );

          if (missingTables.length > 0) {
            console.error('[DBInit] Missing required tables:', missingTables);
            throw new Error(
              `Database is missing tables: ${missingTables.join(', ')}`,
            );
          }
        }

        console.log('[DBInit] Database initialization successful.');
        isInitialized = true;

        // Notify listeners of successful initialization
        this.notifyListeners(null);
      } catch (dbError) {
        console.error('[DBInit] Database error:', dbError);

        // If we've already tried multiple times, give up
        if (initAttempts >= MAX_INIT_ATTEMPTS) {
          throw dbError;
        }

        // Otherwise, try a more drastic approach - reset the database entirely
        console.log('[DBInit] Attempting database reset as recovery...');
        try {
          await this.resetDatabase();
          console.log('[DBInit] Database reset successful.');
          isInitialized = true;
          this.notifyListeners(null);
        } catch (resetError) {
          console.error('[DBInit] Database reset failed:', resetError);
          throw resetError;
        }
      }
    } catch (error) {
      console.error('[DBInit] Database initialization failed:', error);
      isInitialized = false;
      lastError = error instanceof Error ? error : new Error(String(error));

      // Notify listeners of initialization error
      this.notifyListeners(lastError);
      throw lastError;
    } finally {
      isInitializing = false;
    }
  },

  /**
   * Check if the database is initialized
   */
  isInitialized(): boolean {
    return isInitialized;
  },

  /**
   * Check if database initialization is in progress
   */
  isInitializing(): boolean {
    return isInitializing;
  },

  /**
   * Get the last initialization error
   */
  getLastError(): Error | null {
    return lastError;
  },

  /**
   * Get the number of initialization attempts
   */
  getInitAttempts(): number {
    return initAttempts;
  },

  /**
   * Reset the initialization state (useful for retrying)
   */
  reset(): void {
    isInitialized = false;
    isInitializing = false;
    lastError = null;
    // Don't reset initAttempts here to track total attempts
    this.notifyListeners(null);
  },

  /**
   * Force a complete reset (including attempt counter)
   */
  forceReset(): void {
    isInitialized = false;
    isInitializing = false;
    lastError = null;
    initAttempts = 0;
    this.notifyListeners(null);
  },

  /**
   * Add a listener for database state changes
   */
  addListener(listener: DatabaseStateListener): void {
    listeners.push(listener);
  },

  /**
   * Remove a listener
   */
  removeListener(listener: DatabaseStateListener): void {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  },

  /**
   * Notify all listeners of a state change
   */
  notifyListeners(error: Error | null): void {
    listeners.forEach(listener => listener(error));
  },

  /**
   * Reset the database by deleting and recreating
   */
  resetDatabase: async function (): Promise<void> {
    try {
      console.log('[DBInit] Attempting database reset');

      // Use the existing databaseService.resetDatabase() method
      await databaseService.resetDatabase();

      console.log('[DBInit] Database reset successful');

      // Reset our own state
      isInitialized = false;
      isInitializing = false;
      initAttempts = 0;
      lastError = null;
    } catch (error) {
      console.error('[DBInit] Database reset failed:', error);
      throw error;
    }
  },

  /**
   * Initialize the schema if needed
   */
  initializeSchema: async function (): Promise<void> {
    try {
      // We can rely on databaseService to handle the schema initialization
      // since it already does this in its open() method
      await databaseService.open();
      console.log('[DBInit] Schema initialized through databaseService');
    } catch (error) {
      console.error('[DBInit] Schema initialization failed:', error);
      throw error;
    }
  },
};
