import {userDAO} from '@services/dao/UserDAO';
import {User} from '@types/database';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import bcrypt from 'react-native-bcrypt';

// REMOVED: Mock API logic (TEMP_CREDENTIALS, generateToken, loginApi)
// REMOVED: AsyncStorage keys (AUTH_TOKEN_KEY, USER_DATA_KEY, AUTH_PROVIDER_KEY)
// REMOVED: AuthProviderEnum usage (assuming email/password only for now)

const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  isDbLoading: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<User | boolean>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<boolean>; // ADDED register
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoading, setIsLoading] = useState(false); // General loading for login/register/logout
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  // REMOVED: provider state

  // REMOVED: useEffect for database initialization - this now happens in App.tsx
  // via DatabaseInitService before AuthProvider is even mounted

  // REMOVED: useEffect for loading auth state from AsyncStorage

  const login = useCallback(
    async (email: string, password: string): Promise<User | boolean> => {
      console.log('AuthProvider: login attempt');
      setIsLoading(true);
      setError(null);
      try {
        const foundUser = await userDAO.findUserByEmail(email);
        if (!foundUser) {
          throw new Error('Invalid email or password.');
        }

        // Compare hashed password
        const isPasswordMatch = bcrypt.compareSync(
          password,
          foundUser.password_hash,
        );

        if (!isPasswordMatch) {
          throw new Error('Invalid email or password.');
        }

        // Login successful
        setUser(foundUser);
        setIsAuthenticated(true);
        console.log(`AuthProvider: login successful for ${email}`);
        return foundUser;
      } catch (e: any) {
        console.error('AuthProvider: login failed', e);
        setError(e.message || 'Login failed. Please check your credentials.');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
    ): Promise<boolean> => {
      console.log('AuthProvider: register attempt');
      setIsLoading(true);
      setError(null);
      try {
        // Hash the password
        const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

        // Create user in DB
        const newUser = await userDAO.createUser(fullName, email, passwordHash);

        // Automatically log in after successful registration
        setUser(newUser);
        setIsAuthenticated(true);
        console.log(
          `AuthProvider: registration successful and logged in for ${email}`,
        );
        return true;
      } catch (e: any) {
        console.error('AuthProvider: registration failed', e);
        // Handle specific error for existing email
        if (e.message && e.message.includes('Email already exists')) {
          setError(
            'An account with this email already exists. Please try logging in.',
          );
        } else {
          setError(e.message || 'Registration failed. Please try again.');
        }
        setIsAuthenticated(false);
        setUser(null);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<boolean> => {
    console.log('AuthProvider: logout attempt');
    // No async storage to clear, just reset state
    setIsLoading(true); // Indicate activity
    setError(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log('AuthProvider: logout successful');
    setIsLoading(false);
    return true;
    // No complex error handling needed for state reset
  }, []);

  const value = {
    isLoading,
    isAuthenticated,
    user,
    error,
    login,
    register, // ADDED register
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
