import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../redux/slices/authSlice';

const AUTH_KEY = '@stylinx_auth';

export const saveAuth = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save auth', e);
  }
};

export const loadAuth = async (): Promise<User | null> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load auth', e);
    return null;
  }
};

export const clearAuth = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('Failed to clear auth', e);
  }
};
