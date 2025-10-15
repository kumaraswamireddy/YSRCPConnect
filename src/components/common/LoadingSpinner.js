import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, DIMENSIONS } from '../../utils/constants';

const LoadingSpinner = ({
  size = 'large',
  color = COLORS.PRIMARY,
  message,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: DIMENSIONS.PADDING.LG,
  },
  message: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    marginTop: DIMENSIONS.PADDING.MD,
    textAlign: 'center',
  },
});

export default LoadingSpinner;