import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS } from '../../utils/constants';

const ProfileActions = ({
  isOwnProfile,
  isFollowing,
  canCreateOfficialPosts,
  onFollowPress,
  onMessagePress,
  onEditProfilePress,
  onCreateOfficialPost,
}) => {
  // Handle follow button press
  const handleFollowPress = () => {
    if (onFollowPress) {
      onFollowPress();
    }
  };

  // Handle message button press
  const handleMessagePress = () => {
    if (onMessagePress) {
      onMessagePress();
    }
  };

  // Handle edit profile button press
  const handleEditProfilePress = () => {
    if (onEditProfilePress) {
      onEditProfilePress();
    }
  };

  // Handle create official post button press
  const handleCreateOfficialPostPress = () => {
    if (onCreateOfficialPost) {
      onCreateOfficialPost();
    }
  };

  // Render follow button
  const renderFollowButton = () => {
    if (isOwnProfile) return null;

    return (
      <TouchableOpacity
        style={[
          styles.actionButton,
          isFollowing ? styles.followingButton : styles.followButton,
        ]}
        onPress={handleFollowPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.actionButtonText,
            isFollowing ? styles.followingButtonText : styles.followButtonText,
          ]}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render message button
  const renderMessageButton = () => {
    if (isOwnProfile) return null;

    return (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleMessagePress}
        activeOpacity={0.7}
      >
        <Icon name="message" size={20} color={COLORS.PRIMARY} />
        <Text style={styles.actionButtonText}>Message</Text>
      </TouchableOpacity>
    );
  };

  // Render edit profile button
  const renderEditProfileButton = () => {
    if (!isOwnProfile) return null;

    return (
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleEditProfilePress}
        activeOpacity={0.7}
      >
        <Icon name="edit" size={20} color={COLORS.PRIMARY} />
        <Text style={styles.actionButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    );
  };

  // Render create official post button
  const renderCreateOfficialPostButton = () => {
    if (!isOwnProfile || !canCreateOfficialPosts) return null;

    return (
      <TouchableOpacity
        style={[styles.actionButton, styles.officialButton]}
        onPress={handleCreateOfficialPostPress}
        activeOpacity={0.7}
      >
        <Icon name="verified" size={20} color={COLORS.BACKGROUND} />
        <Text style={styles.officialButtonText}>Create Official Post</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderFollowButton()}
      {renderMessageButton()}
      {renderEditProfileButton()}
      {renderCreateOfficialPostButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: DIMENSIONS.PADDING.MD,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: DIMENSIONS.PADDING.MD,
    paddingVertical: DIMENSIONS.PADDING.SM,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    minWidth: 120,
  },
  actionButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    marginLeft: DIMENSIONS.PADDING.XS,
  },
  followButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.PRIMARY,
  },
  followButtonText: {
    color: COLORS.PRIMARY,
  },
  followingButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.BORDER,
  },
  followingButtonText: {
    color: COLORS.TEXT_SECONDARY,
  },
  officialButton: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  officialButtonText: {
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
  },
});

export default ProfileActions;