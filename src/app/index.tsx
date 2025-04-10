import {AuthProvider} from '@/contexts/AuthContext';
import DatabaseErrorScreen from '@components/common/DatabaseErrorScreen';
import DatabaseLoadingScreen from '@components/common/DatabaseLoadingScreen';
import {DatabaseInitService} from '@database/DatabaseInitService';
import store from '@store';
import React, {useEffect, useState} from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {AppNavigator} from './navigation';
import theme from './theme';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);

  // Database initialization
  useEffect(() => {
    const initializeDatabase = async () => {
      console.log(
        `[App] Initializing database (attempt ${initAttempts + 1})...`,
      );

      // Create a timeout promise that will reject after 30 seconds
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject(
            new Error('Database initialization timed out after 30 seconds'),
          );
        }, 30000);
      });

      try {
        // Race between database initialization and timeout
        await Promise.race([DatabaseInitService.initialize(), timeoutPromise]);

        setIsDbReady(true);
        setDbError(null);
        console.log('[App] Database initialized successfully.');
      } catch (error) {
        console.error('[App] Database initialization failed:', error);
        setDbError(error instanceof Error ? error : new Error(String(error)));
        setIsDbReady(false);
      }
    };

    if (!isDbReady && !dbError) {
      initializeDatabase();
    }
  }, [isDbReady, dbError, initAttempts]);

  const handleRetry = () => {
    console.log('[App] Retrying database initialization...');
    DatabaseInitService.reset();
    setDbError(null);
    setInitAttempts(prev => prev + 1);
  };

  // Show loading screen while initializing
  if (!isDbReady && !dbError) {
    return <DatabaseLoadingScreen message="Initializing app..." />;
  }

  // Show error screen if initialization failed
  if (dbError) {
    return <DatabaseErrorScreen error={dbError} retry={handleRetry} />;
  }
  return (
    <SafeAreaProvider>
      {/* <StatusBarProvider> */}
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </Provider>
      </PaperProvider>
      {/* </StatusBarProvider> */}
    </SafeAreaProvider>
  );
}
