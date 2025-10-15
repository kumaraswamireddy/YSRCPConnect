import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import { COLORS, DIMENSIONS, NOTIFICATION_TYPES } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';
import VerificationBadge from '../common/VerificationBadge';
import UserAvatar from '../common/UserAvatar';

const NotificationItem = ({
  notification,
  onPress,
  onDelete,
  onSelect,
  isSelected,
  showSelection,
}) => {
  // Get notification icon and color based on type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.LIKE:
        return { name: 'favorite', color: COLORS.LIKE };
      case NOTIFICATION_TYPES.COMMENT:
        return { name: 'comment', color: COLORS.PRIMARY };
      case NOTIFICATION_TYPES.FOLLOW:
        return { name: 'person-add', color: COLORS.SUCCESS };
      case NOTIFICATION_TYPES.MENTION:
        return { name: 'alternate-email', color: COLORS.PRIMARY };
      case NOTIFICATION_TYPES.POST_APPROVED:
        return { name: 'check-circle', color: COLORS.SUCCESS };
      case NOTIFICATION_TYPES.POST_REJECTED:
        return { name: 'cancel', color: COLORS.ERROR };
      case NOTIFICATION_TYPES.VERIFICATION_APPROVED:
        return { name: 'verified-user', color: COLORS.SUCCESS };
      case NOTIFICATION_TYPES.VERIFICATION_REJECTED:
        return { name: 'error', color: COLORS.ERROR };
      case NOTIFICATION_TYPES.OFFICIAL_POST:
        return { name: 'announcement', color: COLORS.PRIMARY };
      case NOTIFICATION_TYPES.BROADCAST:
        return { name: 'campaign', color: COLORS.ERROR };
      default:
        return { name: 'notifications', color: COLORS.TEXT_SECONDARY };
    }
  };

  const iconInfo = getNotificationIcon();

  // Format notification message
  const formatNotificationMessage = () => {
    if (notification.message) {
      return notification.message;
    }

    // Default message formatting based on type
    switch (notification.type) {
      case NOTIFICATION_TYPES.LIKE:
        return `${notification.sender?.name || 'Someone'} liked your post`;
      case NOTIFICATION_TYPES.COMMENT:
        return `${notification.sender?.name || 'Someone'} commented on your post`;
      case NOTIFICATION_TYPES.FOLLOW:
        return `${notification.sender?.name || 'Someone'} started following you`;
      case NOTIFICATION_TYPES.MENTION:
        return `${notification.sender?.name || 'Someone'} mentioned you in a post`;
      case NOTIFICATION_TYPES.POST_APPROVED:
        return 'Your post has been approved';
      case NOTIFICATION_TYPES.POST_REJECTED:
        return 'Your post has been rejected';
      case NOTIFICATION_TYPES.VERIFICATION_APPROVED:
        return 'Your verification request has been approved';
      case NOTIFICATION_TYPES.VERIFICATION_REJECTED:
        return 'Your verification request has been rejected';
      case NOTIFICATION_TYPES.OFFICIAL_POST:
        return `New official post from ${notification.sender?.name || 'YSRCP'}`;
      case NOTIFICATION_TYPES.BROADCAST:
        return `New broadcast from ${notification.sender?.name || 'YSRCP'}`;
      default:
        return 'You have a new notification';
    }
  };

  // Handle notification press
  const handlePress = () => {
    if (showSelection) {
      onSelect && onSelect();
    } else {
      onPress && onPress();
    }
  };

  // Handle delete button press
  const handleDeletePress = (e) => {
    e.stopPropagation();
    onDelete && onDelete();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.is_read && styles.unreadContainer,
        isSelected && styles.selectedContainer,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {showSelection && (
        <View style={styles.selectionIndicator}>
          <Icon
            name={isSelected ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={isSelected ? COLORS.PRIMARY : COLORS.BORDER}
          />
        </View>
      )}

      <View style={styles.iconContainer}>
        <Icon
          name={iconInfo.name}
          size={24}
          color={iconInfo.color}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {notification.sender && (
            <View style={styles.senderInfo}>
              <UserAvatar
                source={{ uri: notification.sender.profile_pic_url }}
                name={notification.sender.name}
                size={32}
              />
              <View style={styles.senderDetails}>
                <View style={styles.senderNameContainer}>
                  <Text style={styles.senderName}>
                    {notification.sender.name}
                  </Text>
                  {notification.sender.is_verified && (
                    <VerificationBadge user={notification.sender} size="small" />
                  )}
                </View>
                {notification.sender.position && (
                  <Text style={styles.senderPosition}>
                    {notification.sender.position}
                  </Text>
                )}
              </View>
            </View>
          )}

          <View style={styles.meta}>
            <Text style={styles.time}>
              {formatTime(notification.created_at)}
            </Text>
            
            {onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePress}
              >
                <Icon name="close" size={18} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.message}>
          {formatNotificationMessage()}
        </Text>

        {notification.data?.previewImage && (
          <View style={styles.previewContainer}>
            <FastImage
              source={{ uri: notification.data.previewImage }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {!notification.is_read && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: DIMENSIONS.PADDING.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  unreadContainer: {
    backgroundColor: '#F8F9FA',
  },
  selectedContainer: {
    backgroundColor: '#E3F2FD',
  },
  selectionIndicator: {
    marginRight: DIMENSIONS.PADDING.SM,
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: DIMENSIONS.PADDING.MD,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DIMENSIONS.PADDING.XS,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  senderDetails: {
    marginLeft: DIMENSIONS.PADDING.SM,
    flex: 1,
  },
  senderNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  senderPosition: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginRight: DIMENSIONS.PADDING.SM,
  },
  deleteButton: {
    padding: DIMENSIONS.PADDING.XS,
  },
  message: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 20,
    marginBottom: DIMENSIONS.PADDING.XS,
  },
  previewContainer: {
    marginTop: DIMENSIONS.PADDING.SM,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 120,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
    marginLeft: DIMENSIONS.PADDING.SM,
  },
});

export default NotificationItem;