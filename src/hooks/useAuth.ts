import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken'); // Replace with your actual auth key
        setIsLoggedIn(!!authToken);
      } catch (error) {
        console.log('Error checking login status:', error);
        setIsLoggedIn(false); // Assume not logged in on error
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return {isLoggedIn, loading};
};

export default useAuthCheck;
