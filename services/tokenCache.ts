import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const tokenCache = {
  async getToken(key: string) {
    if (Platform.OS === 'web') {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("localStorage get item error: ", error);
        localStorage.removeItem(key);
        return null;
      }
    } else {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    }
  },

  async saveToken(key: string, value: string) {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error("localStorage set item error: ", err);
      }
    } else {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (err) {
        console.error("SecureStore set item error: ", err);
      }
    }
  },
};

export default tokenCache;