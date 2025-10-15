import { apiService } from './api';

class NotificationService {
  async getNotifications(page = 1, limit = 20) {
    try {
      const response = await apiService.get('/notifications', {
        page,
        limit,
      });
      
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await apiService.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await apiService.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      const response = await apiService.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  async getNotificationPreferences() {
    try {
      const response = await apiService.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Get notification preferences error:', error);
      throw error;
    }
  }

  async updatePreferences(preferences) {
    try {
      const response = await apiService.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  }

  async registerDevice(deviceToken) {
    try {
      const response = await apiService.post('/notifications/register-device', {
        device_token: deviceToken,
        platform: Platform.OS,
      });
      return response.data;
    } catch (error) {
      console.error('Register device error:', error);
      throw error;
    }
  }

  async unregisterDevice(deviceToken) {
    try {
      const response = await apiService.delete('/notifications/unregister-device', {
        device_token: deviceToken,
      });
      return response.data;
    } catch (error) {
      console.error('Unregister device error:', error);
      throw error;
    }
  }

  // Push notification handling
  async requestPermissions() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Request notification permissions error:', error);
      return false;
    }
  }

  async getDeviceToken() {
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        experienceId: '@your-username/your-app-slug',
      });
      return token.data;
    } catch (error) {
      console.error('Get device token error:', error);
      return null;
    }
  }

  // Notification categories and types
  getNotificationIcon(type) {
    switch (type) {
      case 'like':
        return 'favorite';
      case 'comment':
        return 'comment';
      case 'follow':
        return 'person-add';
      case 'mention':
        return 'alternate-email';
      case 'post_approved':
        return 'check-circle';
      case 'post_rejected':
        return 'cancel';
      case 'verification_approved':
        return 'verified-user';
      case 'verification_rejected':
        return 'error';
      case 'official_post':
        return 'announcement';
      case 'broadcast':
        return 'campaign';
      default:
        return 'notifications';
    }
  }

  getNotificationColor(type) {
    switch (type) {
      case 'like':
        return '#E1306C';
      case 'comment':
        return '#1DA1F2';
      case 'follow':
        return '#17BF63';
      case 'mention':
        return '#1DA1F2';
      case 'post_approved':
        return '#17BF63';
      case 'post_rejected':
        return '#E1306C';
      case 'verification_approved':
        return '#17BF63';
      case 'verification_rejected':
        return '#E1306C';
      case 'official_post':
        return '#794BC4';
      case 'broadcast':
        return '#F45D22';
      default:
        return '#657786';
    }
  }

  formatNotificationMessage(notification) {
    const { type, sender, target } = notification;
    
    switch (type) {
      case 'like':
        return `${sender.name} liked your post`;
      case 'comment':
        return `${sender.name} commented on your post`;
      case 'follow':
        return `${sender.name} started following you`;
      case 'mention':
        return `${sender.name} mentioned you in a post`;
      case 'post_approved':
        return 'Your post has been approved';
      case 'post_rejected':
        return 'Your post has been rejected';
      case 'verification_approved':
        return 'Your verification request has been approved';
      case 'verification_rejected':
        return 'Your verification request has been rejected';
      case 'official_post':
        return `New official post from ${sender.name}`;
      case 'broadcast':
        return `New broadcast from ${sender.name}`;
      default:
        return 'You have a new notification';
    }
  }

  // Local notification helpers
  async scheduleLocalNotification(title, body, data = {}) {
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
      console.error('Schedule local notification error:', error);
      return null;
    }
  }

  async cancelLocalNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.error('Cancel local notification error:', error);
      return false;
    }
  }

  // Badge count management
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
      return true;
    } catch (error) {
      console.error('Set badge count error:', error);
      return false;
    }
  }

  async getBadgeCount() {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Get badge count error:', error);
      return 0;
    }
  }

  // Notification channels (Android)
  async createNotificationChannels() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('mentions', {
          name: 'Mentions',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1DA1F2',
        });

        await Notifications.setNotificationChannelAsync('official', {
          name: 'Official',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#794BC4',
        });
      }
    } catch (error) {
      console.error('Create notification channels error:', error);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;