import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS } from '../../utils/constants';
import VerificationBadge from '../common/VerificationBadge';

const UserAboutTab = ({
  profile,
  isOwnProfile,
  onEditProfile,
}) => {
  // Handle edit profile button press
  const handleEditProfilePress = () => {
    if (onEditProfile) {
      onEditProfile();
    }
  };

  // Format join date
  const formatJoinDate = () => {
    if (!profile?.created_at) return 'Unknown';
    
    const date = new Date(profile.created_at);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Render info item
  const renderInfoItem = (icon, title, value) => {
    if (!value) return null;

    return (
      <View style={styles.infoItem}>
        <Icon name={icon} size={20} color={COLORS.TEXT_SECONDARY} />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>{title}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        {profile?.bio ? (
          <Text style={styles.bio}>{profile.bio}</Text>
        ) : (
          <Text style={styles.noBio}>
            {isOwnProfile
              ? 'Add a bio to tell people about yourself'
              : 'No bio available'}
          </Text>
        )}
        
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfilePress}
          >
            <Icon name="edit" size={16} color={COLORS.PRIMARY} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information</Text>
        
        {renderInfoItem(
          'person',
          'Name',
          profile?.name
        )}
        
        {renderInfoItem(
          'email',
          'Email',
          profile?.email
        )}
        
        {renderInfoItem(
          'work',
          'Position',
          profile?.position
        )}
        
        {renderInfoItem(
          'groups',
          'Committee',
          profile?.committee_name
        )}
        
        {renderInfoItem(
          'location-on',
          'Constituency',
          profile?.constituency
        )}
        
        {renderInfoItem(
          'calendar-today',
          'Joined',
          formatJoinDate()
        )}
      </View>

      {profile?.is_verified && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          
          <View style={styles.verificationContainer}>
            <VerificationBadge user={profile} size="medium" />
            <Text style={styles.verificationText}>
              This is a verified account with special privileges on the platform.
            </Text>
          </View>
        </View>
      )}

      {profile?.role && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role</Text>
          
          <View style={styles.roleContainer}>
            <Icon
              name={
                profile.role === 'admin'
                  ? 'admin-panel-settings'
                  : profile.role === 'committee'
                    ? 'how-to-vote'
                    : 'people'
              }
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.roleText}>
              {profile.role === 'admin'
                ? 'Administrator'
                : profile.role === 'committee'
                  ? 'Committee Member'
                  : 'Party Worker'}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  contentContainer: {
    padding: DIMENSIONS.PADDING.LG,
  },
  section: {
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  bio: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  noBio: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: 'italic',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    marginLeft: DIMENSIONS.PADDING.XS,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  infoContent: {
    marginLeft: DIMENSIONS.PADDING.MD,
    flex: 1,
  },
  infoTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verificationText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: DIMENSIONS.PADDING.SM,
    flex: 1,
    lineHeight: 20,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: DIMENSIONS.PADDING.SM,
  },
});

export default UserAboutTab;