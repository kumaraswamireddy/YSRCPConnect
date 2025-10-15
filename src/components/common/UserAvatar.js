import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { COLORS, DIMENSIONS } from '../../utils/constants';
import { getInitials, stringToColor } from '../../utils/helpers';

const UserAvatar = ({
  source,
  name,
  size = 40,
  style,
  showBorder = false,
  borderColor = COLORS.PRIMARY,
  borderWidth = 2,
}) => {
  // If source is provided, use it
  if (source && source.uri) {
    return (
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: showBorder ? borderWidth : 0,
            borderColor: showBorder ? borderColor : 'transparent',
          },
          style,
        ]}
      >
        <FastImage
          source={source}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>
    );
  }

  // If no source, generate initials avatar
  const initials = getInitials(name || 'User');
  const initialsColor = stringToColor(name || 'User');

  return (
    <View
      style={[
        styles.container,
        styles.initialsContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: initialsColor,
          borderWidth: showBorder ? borderWidth : 0,
          borderColor: showBorder ? borderColor : 'transparent',
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size / 2.5,
            color: COLORS.BACKGROUND,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
  },
});

export default UserAvatar;