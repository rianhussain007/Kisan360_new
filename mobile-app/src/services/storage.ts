import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage service placeholder
export const initializeStorage = async () => {
  try {
    // Add storage initialization logic here
    console.log('Storage initialized successfully');
    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    throw error;
  }
};

// Storage helper functions
export const storage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  },

  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      throw error;
    }
  },

  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  },
};
