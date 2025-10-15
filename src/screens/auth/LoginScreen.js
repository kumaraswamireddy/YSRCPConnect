import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS, SCREEN_NAMES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';
import { clearError } from '../../store/authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { loginWithGoogle } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);
      showLoading('Signing in...');
      
      await loginWithGoogle();
      
      // Navigate to role selection
      navigation.dispatch(
        StackActions.replace(SCREEN_NAMES.ROLE_SELECTION)
      );
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoggingIn(false);
      hideLoading();
    }
  };

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>YSRCPConnect</Text>
          <Text style={styles.tagline}>Connect with Party Workers</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome to YSRCPConnect</Text>
            <Text style={styles.subtitleText}>
              Sign in with your Google account to get started
            </Text>
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoggingIn}
            activeOpacity={0.8}
          >
            <View style={styles.googleButtonContent}>
              <Image
                source={require('../../../assets/google-icon.png')}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>
                Sign in with Google
              </Text>
              {isLoggingIn && (
                <ActivityIndicator
                  size="small"
                  color={COLORS.TEXT_PRIMARY}
                  style={styles.buttonLoader}
                />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="check-circle" size={20} color={COLORS.SUCCESS} />
              <Text style={styles.infoText}>
                Secure authentication with Google
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="check-circle" size={20} color={COLORS.SUCCESS} />
              <Text style={styles.infoText}>
                No password required
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="check-circle" size={20} color={COLORS.SUCCESS} />
              <Text style={styles.infoText}>
                Quick and easy setup
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: DIMENSIONS.PADDING.LG,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  appName: {
    fontSize: DIMENSIONS.FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: DIMENSIONS.PADDING.XS,
  },
  tagline: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: DIMENSIONS.PADDING.LG,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  welcomeText: {
    fontSize: DIMENSIONS.FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    marginBottom: DIMENSIONS.PADDING.XL,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: DIMENSIONS.PADDING.SM,
  },
  googleButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  buttonLoader: {
    marginLeft: DIMENSIONS.PADDING.SM,
  },
  infoContainer: {
    marginTop: DIMENSIONS.PADDING.LG,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  infoText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: DIMENSIONS.PADDING.SM,
    flex: 1,
  },
  footerContainer: {
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    marginTop: DIMENSIONS.PADDING.LG,
  },
  footerText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen;