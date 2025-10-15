import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../services/notifications';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(page, limit);
      return { ...response, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      return { notificationId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAllAsRead();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async ({ notificationId }, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      return { notificationId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'notifications/updateNotificationPreferences',
  async ({ preferences }, { rejectWithValue }) => {
    try {
      const response = await notificationService.updatePreferences(preferences);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update notification preferences');
    }
  }
);

export const registerDeviceToken = createAsyncThunk(
  'notifications/registerDeviceToken',
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await notificationService.registerDevice(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register device token');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  preferences: {
    push_notifications: true,
    email_notifications: false,
    new_followers: true,
    post_likes: true,
    post_comments: true,
    mentions: true,
    official_posts: true,
  },
  deviceTokenRegistered: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = action.payload;
      state.notifications.unshift(notification);
      
      if (!notification.is_read) {
        state.unreadCount += 1;
      }
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.currentPage = 1;
      state.hasMore = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const { notifications, page, unreadCount } = action.payload;
        
        if (page === 1) {
          state.notifications = notifications;
        } else {
          state.notifications = [...state.notifications, ...notifications];
        }
        
        state.loading = false;
        state.currentPage = page;
        state.hasMore = notifications.length === 20;
        state.unreadCount = unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notificationIndex = state.notifications.findIndex(
          notification => notification.id === notificationId
        );
        
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex];
          if (!notification.is_read) {
            notification.is_read = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      // Mark all notifications as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.is_read = true;
        });
        state.unreadCount = 0;
      })
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notificationIndex = state.notifications.findIndex(
          notification => notification.id === notificationId
        );
        
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex];
          if (!notification.is_read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(notificationIndex, 1);
        }
      })
      // Update notification preferences
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload.preferences };
      })
      // Register device token
      .addCase(registerDeviceToken.fulfilled, (state) => {
        state.deviceTokenRegistered = true;
      });
  },
});

export const { 
  addNotification, 
  updateUnreadCount, 
  clearNotifications, 
  clearError 
} = notificationsSlice.actions;

export default notificationsSlice.reducer;