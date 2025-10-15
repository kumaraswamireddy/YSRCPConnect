import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS, NOTIFICATION_TYPES } from '../../utils/constants';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../../store/notificationsSlice';
import { notificationService } from '../../services/notifications';
import NotificationItem from '../../components/notifications/NotificationItem';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const NotificationsScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    notifications,
    unreadCount,
    loading,
    refreshing,
    error,
    hasMore,
    currentPage,
  } = useSelector((state) => state.notifications);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const flatListRef = useRef(null);

  // Load notifications on component mount
  useEffect(() => {
    loadInitialNotifications();
  }, []);

  const loadInitialNotifications = async () => {
    try {
      setIsInitialLoad(true);
      await dispatch(fetchNotifications({ page: 1, limit: 20 })).unwrap();
    } catch (error) {
      console.error('Error loading initial notifications:', error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await dispatch(fetchNotifications({ page: 1, limit: 20, refresh: true })).unwrap();
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      const nextPage = currentPage + 1;
      await dispatch(fetchNotifications({ page: nextPage, limit: 20 })).unwrap();
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  }, [hasMore, loading, currentPage, dispatch]);

  // Handle notification press
  const handleNotificationPress = useCallback(async (notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      try {
        await dispatch(markNotificationAsRead({ notificationId: notification.id })).unwrap();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate based on notification type
    switch (notification.type) {
      case NOTIFICATION_TYPES.LIKE:
      case NOTIFICATION_TYPES.COMMENT:
      case NOTIFICATION_TYPES.MENTION:
        if (notification.data?.postId) {
          navigation.navigate('PostDetail', { postId: notification.data.postId });
        }
        break;
      case NOTIFICATION_TYPES.FOLLOW:
        if (notification.data?.userId) {
          navigation.navigate('Profile', { userId: notification.data.userId });
        }
        break;
      case NOTIFICATION_TYPES.VERIFICATION_APPROVED:
      case NOTIFICATION_TYPES.VERIFICATION_REJECTED:
        navigation.navigate('Profile');
        break;
      default:
        // Default to profile
        navigation.navigate('Profile');
        break;
    }
  }, [dispatch, navigation]);

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      Alert.alert(
        'Error',
        'Failed to mark all notifications as read. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [dispatch]);

  // Handle delete notification
  const handleDeleteNotification = useCallback(async (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteNotification({ notificationId })).unwrap();
            } catch (error) {
              console.error('Error deleting notification:', error);
              Alert.alert(
                'Error',
                'Failed to delete notification. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  }, [dispatch]);

  // Handle notification selection
  const handleSelectNotification = useCallback((notificationId) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  }, [selectedNotifications]);

  // Handle select all notifications
  const handleSelectAll = useCallback(() => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
  }, [selectedNotifications, notifications]);

  // Handle delete selected notifications
  const handleDeleteSelected = useCallback(() => {
    if (selectedNotifications.size === 0) return;

    Alert.alert(
      `Delete ${selectedNotifications.size} Notification${selectedNotifications.size > 1 ? 's' : ''}`,
      'Are you sure you want to delete the selected notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const promises = Array.from(selectedNotifications).map(id =>
                dispatch(deleteNotification({ notificationId: id })).unwrap()
              );
              await Promise.all(promises);
              setSelectedNotifications(new Set());
            } catch (error) {
              console.error('Error deleting selected notifications:', error);
              Alert.alert(
                'Error',
                'Failed to delete some notifications. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  }, [selectedNotifications, dispatch]);

  // Render notification item
  const renderNotification = useCallback(({ item }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onDelete={() => handleDeleteNotification(item.id)}
      onSelect={() => handleSelectNotification(item.id)}
      isSelected={selectedNotifications.has(item.id)}
      showSelection={selectedNotifications.size > 0}
    />
  ), [handleNotificationPress, handleDeleteNotification, handleSelectNotification, selectedNotifications]);

  // Render footer
  const renderFooter = useCallback(() => {
    if (!hasMore) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>You've reached the end</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </View>
      );
    }

    return null;
  }, [hasMore, loading]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (isInitialLoad) {
      return null;
    }

    return (
      <EmptyState
        icon="notifications-none"
        title="No Notifications"
        message="You're all caught up! New notifications will appear here"
      />
    );
  }, [isInitialLoad]);

  // Key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Get list header component
  const ListHeader = useCallback(() => {
    if (notifications.length === 0) return null;

    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notifications</Text>
        
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.markAllButtonText}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectAll}
          >
            <Text style={styles.selectButtonText}>
              {selectedNotifications.size === notifications.length ? 'Deselect all' : 'Select all'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedNotifications.size > 0 && (
          <View style={styles.selectionContainer}>
            <Text style={styles.selectionText}>
              {selectedNotifications.size} selected
            </Text>
            <TouchableOpacity
              style={styles.deleteSelectedButton}
              onPress={handleDeleteSelected}
            >
              <Icon name="delete" size={20} color={COLORS.ERROR} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }, [
    notifications.length,
    unreadCount,
    selectedNotifications.size,
    notifications.length,
    handleMarkAllAsRead,
    handleSelectAll,
    handleDeleteSelected,
  ]);

  // Show error message
  if (error && !loading && notifications.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          title="Error Loading Notifications"
          message={error}
          onRetry={loadInitialNotifications}
        />
      </View>
    );
  }

  // Show loading spinner on initial load
  if (isInitialLoad) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContainer: {
    paddingBottom: DIMENSIONS.PADDING.LG,
  },
  headerContainer: {
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  markAllButton: {
    paddingVertical: DIMENSIONS.PADDING.XS,
  },
  markAllButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.PRIMARY,
  },
  selectButton: {
    paddingVertical: DIMENSIONS.PADDING.XS,
  },
  selectButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.PRIMARY,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: DIMENSIONS.PADDING.MD,
    paddingVertical: DIMENSIONS.PADDING.SM,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
  },
  selectionText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  deleteSelectedButton: {
    padding: DIMENSIONS.PADDING.XS,
  },
  footerContainer: {
    paddingVertical: DIMENSIONS.PADDING.LG,
    alignItems: 'center',
  },
  footerText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default NotificationsScreen;