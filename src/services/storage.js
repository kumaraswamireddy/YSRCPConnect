import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Keys for different data types
  keys = {
    USER_TOKEN: 'userToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
    FEED_CACHE: 'feedCache',
    PROFILE_CACHE: 'profileCache',
    NOTIFICATIONS_CACHE: 'notificationsCache',
    APP_SETTINGS: 'appSettings',
    DEVICE_TOKEN: 'deviceToken',
    ONBOARDING_COMPLETED: 'onboardingCompleted',
    BIOMETRIC_ENABLED: 'biometricEnabled',
    THEME: 'theme',
    LANGUAGE: 'language',
  };

  // Generic methods
  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  async getItem(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing all storage:', error);
      return false;
    }
  }

  // Auth specific methods
  async setUserToken(token) {
    return this.setItem(this.keys.USER_TOKEN, token);
  }

  async getUserToken() {
    return this.getItem(this.keys.USER_TOKEN);
  }

  async setRefreshToken(token) {
    return this.setItem(this.keys.REFRESH_TOKEN, token);
  }

  async getRefreshToken() {
    return this.getItem(this.keys.REFRESH_TOKEN);
  }

  async setUserData(userData) {
    return this.setItem(this.keys.USER_DATA, userData);
  }

  async getUserData() {
    return this.getItem(this.keys.USER_DATA);
  }

  async clearAuthData() {
    try {
      await Promise.all([
        this.removeItem(this.keys.USER_TOKEN),
        this.removeItem(this.keys.REFRESH_TOKEN),
        this.removeItem(this.keys.USER_DATA),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }

  // Cache methods
  async setFeedCache(feedData) {
    return this.setItem(this.keys.FEED_CACHE, {
      data: feedData,
      timestamp: Date.now(),
    });
  }

  async getFeedCache(maxAge = 5 * 60 * 1000) { // 5 minutes default
    const cache = await this.getItem(this.keys.FEED_CACHE);
    
    if (!cache) return null;
    
    const { data, timestamp } = cache;
    const isExpired = Date.now() - timestamp > maxAge;
    
    return isExpired ? null : data;
  }

  async setProfileCache(profileData) {
    return this.setItem(this.keys.PROFILE_CACHE, {
      data: profileData,
      timestamp: Date.now(),
    });
  }

  async getProfileCache(maxAge = 10 * 60 * 1000) { // 10 minutes default
    const cache = await this.getItem(this.keys.PROFILE_CACHE);
    
    if (!cache) return null;
    
    const { data, timestamp } = cache;
    const isExpired = Date.now() - timestamp > maxAge;
    
    return isExpired ? null : data;
  }

  async setNotificationsCache(notificationsData) {
    return this.setItem(this.keys.NOTIFICATIONS_CACHE, {
      data: notificationsData,
      timestamp: Date.now(),
    });
  }

  async getNotificationsCache(maxAge = 2 * 60 * 1000) { // 2 minutes default
    const cache = await this.getItem(this.keys.NOTIFICATIONS_CACHE);
    
    if (!cache) return null;
    
    const { data, timestamp } = cache;
    const isExpired = Date.now() - timestamp > maxAge;
    
    return isExpired ? null : data;
  }

  // Settings methods
  async setAppSettings(settings) {
    return this.setItem(this.keys.APP_SETTINGS, settings);
  }

  async getAppSettings() {
    const defaultSettings = {
      theme: 'light',
      language: 'en',
      pushNotifications: true,
      autoPlayVideos: true,
      dataSaverMode: false,
      showSensitiveContent: false,
    };
    
    const settings = await this.getItem(this.keys.APP_SETTINGS);
    return { ...defaultSettings, ...settings };
  }

  async updateAppSettings(newSettings) {
    const currentSettings = await this.getAppSettings();
    return this.setAppSettings({ ...currentSettings, ...newSettings });
  }

  // Device token
  async setDeviceToken(token) {
    return this.setItem(this.keys.DEVICE_TOKEN, token);
  }

  async getDeviceToken() {
    return this.getItem(this.keys.DEVICE_TOKEN);
  }

  // Onboarding
  async setOnboardingCompleted(completed = true) {
    return this.setItem(this.keys.ONBOARDING_COMPLETED, completed);
  }

  async isOnboardingCompleted() {
    return this.getItem(this.keys.ONBOARDING_COMPLETED) || false;
  }

  // Biometric
  async setBiometricEnabled(enabled) {
    return this.setItem(this.keys.BIOMETRIC_ENABLED, enabled);
  }

  async isBiometricEnabled() {
    return this.getItem(this.keys.BIOMETRIC_ENABLED) || false;
  }

  // Theme
  async setTheme(theme) {
    return this.setItem(this.keys.THEME, theme);
  }

  async getTheme() {
    return this.getItem(this.keys.THEME) || 'light';
  }

  // Language
  async setLanguage(language) {
    return this.setItem(this.keys.LANGUAGE, language);
  }

  async getLanguage() {
    return this.getItem(this.keys.LANGUAGE) || 'en';
  }

  // Storage management
  async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keyInfo = [];
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        keyInfo.push({
          key,
          size: value ? value.length : 0,
        });
      }
      
      return {
        totalKeys: keys.length,
        totalSize: keyInfo.reduce((sum, item) => sum + item.size, 0),
        keys: keyInfo,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }

  async clearCache() {
    try {
      await Promise.all([
        this.removeItem(this.keys.FEED_CACHE),
        this.removeItem(this.keys.PROFILE_CACHE),
        this.removeItem(this.keys.NOTIFICATIONS_CACHE),
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }

  // Cleanup expired cache
  async cleanupExpiredCache() {
    try {
      const now = Date.now();
      const maxAge = {
        [this.keys.FEED_CACHE]: 5 * 60 * 1000, // 5 minutes
        [this.keys.PROFILE_CACHE]: 10 * 60 * 1000, // 10 minutes
        [this.keys.NOTIFICATIONS_CACHE]: 2 * 60 * 1000, // 2 minutes
      };

      for (const [key, age] of Object.entries(maxAge)) {
        const cache = await this.getItem(key);
        
        if (cache && cache.timestamp) {
          if (now - cache.timestamp > age) {
            await this.removeItem(key);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error cleaning up expired cache:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();
export default storageService;