import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notifications';
import { useDispatch } from 'react-redux';
import { addNotification, updateUnreadCount } from '../store/notificationsSlice';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushToken, setPushToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const dispatch = useDispatch();

  // Initialize notifications
  useEffect(() => {
    initializeNotifications();
    
    return () => {
      // Clean up listeners
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('Notification permissions not granted');
        return;
      }

      // Get push token
      const token = await getPushToken();
      if (token) {
        setPushToken(token);
        // Register token with backend
        await registerDeviceToken(token);
      }

      // Set up notification listeners
      setupNotificationListeners();

      // Create notification channels (Android)
      await notificationService.createNotificationChannels();

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } else {
      return true;
    }
  };

  const getPushToken = async () => {
    try {
      if (Platform.OS === 'android') {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          return null;
        }
      }

      const token = await Notifications.getExpoPushTokenAsync({
        experienceId: '@your-username/your-app-slug',
      });
      
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const registerDeviceToken = async (token) => {
    try {
      await notificationService.registerDevice(token);
      console.log('Device token registered successfully');
    } catch (error) {
      console.error('Error registering device token:', error);
    }
  };

  const setupNotificationListeners = () => {
    // Listen for notifications received in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        handleReceivedNotification(notification);
      }
    );

    // Listen for user interacting with notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handleNotificationResponse(response);
      }
    );
  };

  const handleReceivedNotification = (notification) => {
    const { data } = notification.request.content;
    
    // Add notification to Redux store
    if (data && data.id) {
      dispatch(addNotification({
        id: data.id,
        type: data.type || 'general',
        title: notification.request.content.title,
        body: notification.request.content.body,
        data: data,
        is_read: false,
        created_at: new Date().toISOString(),
      }));
    }
  };

  const handleNotificationResponse = (response) => {
    const { data } = response.notification.request.content;
    
    // Handle notification tap
    if (data && data.type) {
      handleNotificationTap(data.type, data);
    }
  };

  const handleNotificationTap = (type, data) => {
    // Navigate to appropriate screen based on notification type
    switch (type) {
      case 'like':
      case 'comment':
      case 'mention':
        // Navigate to post detail
        if (data.postId) {
          // navigation.navigate('PostDetail', { postId: data.postId });
        }
        break;
      case 'follow':
        // Navigate to user profile
        if (data.userId) {
          // navigation.navigate('Profile', { userId: data.userId });
        }
        break;
      case 'verification_approved':
      case 'verification_rejected':
        // Navigate to profile
        // navigation.navigate('Profile');
        break;
      default:
        // Navigate to notifications
        // navigation.navigate('Notifications');
        break;
    }
  };

  // Schedule a local notification
  const scheduleLocalNotification = async (title, body, data = {}) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Show immediately
      });
      
      return notificationId;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      return null;
    }
  };

  // Cancel a local notification
  const cancelLocalNotification = async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.error('Error canceling local notification:', error);
      return false;
    }
  };

  // Set badge count
  const setBadgeCount = async (count) => {
    try {
      await Notifications.setBadgeCountAsync(count);
      dispatch(updateUnreadCount(count));
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  };

  // Get badge count
  const getBadgeCount = async () => {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      await setBadgeCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  // Show an alert notification
  const showAlert = (title, message, buttons = []) => {
    Alert.alert(
      title,
      message,
      buttons.length > 0 ? buttons : [{ text: 'OK', style: 'default' }]
    );
  };

  const value = {
    isInitialized,
    pushToken,
    scheduleLocalNotification,
    cancelLocalNotification,
    setBadgeCount,
    getBadgeCount,
    clearAllNotifications,
    showAlert,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;