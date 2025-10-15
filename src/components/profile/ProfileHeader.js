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
import { COLORS, DIMENSIONS } from '../../utils/constants';
import VerificationBadge from '../common/VerificationBadge';
import UserAvatar from '../common/UserAvatar';

const ProfileHeader = ({
  profile,
  isOwnProfile,
  onEditProfile,
  onSettingsPress,
}) => {
  // Handle edit profile button press
  const handleEditProfilePress = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  // Handle settings button press
  const handleSettingsPress = () => {
    if (onSettingsPress) {
      onSettingsPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.coverPhotoContainer}>
        {profile?.cover_pic_url ? (
          <FastImage
            source={{ uri: profile.cover_pic_url }}
            style={styles.coverPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.coverPhoto, styles.defaultCoverPhoto]} />
        )}
        
        {isOwnProfile && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEditProfilePress}
            >
              <Icon name="edit" size={20} color={COLORS.BACKGROUND} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSettingsPress}
            >
              <Icon name="settings" size={20} color={COLORS.BACKGROUND} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <UserAvatar
            source={{ uri: profile?.profile_pic_url }}
            name={profile?.name}
            size={80}
            showBorder={true}
            borderColor={COLORS.BACKGROUND}
            borderWidth={3}
          />
        </View>
        
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{profile?.name}</Text>
          <View style={styles.verificationContainer}>
            <VerificationBadge user={profile} size="medium" />
          </View>
        </View>
        
        {(profile?.position || profile?.committee_name) && (
          <View style={styles.positionContainer}>
            <Text style={styles.position}>
              {profile?.position && profile?.committee_name
                ? `${profile.position}, ${profile.committee_name}`
                : profile?.position || profile?.committee_name}
            </Text>
          </View>
        )}
        
        {profile?.bio && (
          <View style={styles.bioContainer}>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>
        )}
        
        <View style={styles.joinDateContainer}>
          <Text style={styles.joinDate}>
            Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
  },
  coverPhotoContainer: {
    height: 150,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  defaultCoverPhoto: {
    backgroundColor: COLORS.PRIMARY,
  },
  headerActions: {
    position: 'absolute',
    top: DIMENSIONS.PADDING.MD,
    right: DIMENSIONS.PADDING.MD,
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: DIMENSIONS.PADDING.SM,
  },
  profileInfo: {
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingBottom: DIMENSIONS.PADDING.LG,
  },
  avatarContainer: {
    marginTop: -40,
    alignSelf: 'center',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  name: {
    fontSize: DIMENSIONS.FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  verificationContainer: {
    marginLeft: DIMENSIONS.PADDING.SM,
  },
  positionContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  position: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  bioContainer: {
    marginVertical: DIMENSIONS.PADDING.SM,
  },
  bio: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  joinDateContainer: {
    alignItems: 'center',
  },
  joinDate: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default ProfileHeader;