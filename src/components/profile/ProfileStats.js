import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, DIMENSIONS } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';

const ProfileStats = ({
  postsCount,
  followersCount,
  followingCount,
  onFollowersPress,
  onFollowingPress,
}) => {
  // Handle followers press
  const handleFollowersPress = () => {
    if (onFollowersPress) {
      onFollowersPress();
    }
  };

  // Handle following press
  const handleFollowingPress = () => {
    if (onFollowingPress) {
      onFollowingPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statContainer}>
        <Text style={styles.statNumber}>{formatNumber(postsCount)}</Text>
        <Text style={styles.statLabel}>Posts</Text>
      </View>
      
      <TouchableOpacity
        style={styles.statContainer}
        onPress={handleFollowersPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{formatNumber(followersCount)}</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.statContainer}
        onPress={handleFollowingPress}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>{formatNumber(followingCount)}</Text>
        <Text style={styles.statLabel}>Following</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: DIMENSIONS.PADDING.MD,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER,
  },
  statContainer: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
});

export default ProfileStats;