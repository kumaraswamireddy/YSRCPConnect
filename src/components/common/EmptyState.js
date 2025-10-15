import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS } from '../../utils/constants';

const EmptyState = ({
  icon,
  title,
  message,
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon
          name={icon || 'inbox'}
          size={64}
          color={COLORS.TEXT_SECONDARY}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        {actionText && onAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAction}
          >
            <Text style={styles.actionButtonText}>{actionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.PADDING.XL,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: DIMENSIONS.FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginTop: DIMENSIONS.PADDING.LG,
    marginBottom: DIMENSIONS.PADDING.SM,
    textAlign: 'center',
  },
  message: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: DIMENSIONS.PADDING.LG,
  },
  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
  },
  actionButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
});

export default EmptyState;