import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS, USER_ROLES } from '../../utils/constants';

const VerificationBadge = ({ user, size = 'medium', style }) => {
  if (!user || !user.is_verified) {
    return null;
  }

  // Determine badge type based on user role
  const getBadgeType = () => {
    if (user.role === USER_ROLES.ADMIN) {
      return {
        color: COLORS.ADMIN_BADGE,
        icon: 'stars',
        text: 'Admin',
      };
    } else if (user.role === USER_ROLES.COMMITTEE) {
      return {
        color: COLORS.COMMITTEE_BADGE,
        icon: 'verified',
        text: 'Verified',
      };
    } else {
      // Default verified user
      return {
        color: COLORS.SUCCESS,
        icon: 'verified',
        text: 'Verified',
      };
    }
  };

  const badgeType = getBadgeType();

  // Get dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return {
          containerHeight: 18,
          iconSize: 12,
          fontSize: 10,
          paddingHorizontal: 6,
        };
      case 'large':
        return {
          containerHeight: 24,
          iconSize: 16,
          fontSize: 12,
          paddingHorizontal: 8,
        };
      default: // medium
        return {
          containerHeight: 20,
          iconSize: 14,
          fontSize: 11,
          paddingHorizontal: 7,
        };
    }
  };

  const dimensions = getDimensions();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badgeType.color,
          height: dimensions.containerHeight,
          paddingHorizontal: dimensions.paddingHorizontal,
        },
        style,
      ]}
    >
      <Icon
        name={badgeType.icon}
        size={dimensions.iconSize}
        color={COLORS.BACKGROUND}
      />
      <Text
        style={[
          styles.text,
          {
            fontSize: dimensions.fontSize,
            color: COLORS.BACKGROUND,
          },
        ]}
      >
        {badgeType.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: 'bold',
    marginLeft: 2,
  },
});

export default VerificationBadge;