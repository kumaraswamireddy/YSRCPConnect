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
import { COLORS, DIMENSIONS, SCREEN_NAMES, USER_ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';
import { clearError } from '../../store/authSlice';

const RoleSelectionScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const { selectUserRole, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      Alert.alert('Role Required', 'Please select a role to continue');
      return;
    }

    try {
      setIsSubmitting(true);
      showLoading('Setting up your account...');
      
      await selectUserRole(selectedRole);
      
      // Navigate based on role
      if (selectedRole === USER_ROLES.COMMITTEE) {
        navigation.dispatch(
          StackActions.replace(SCREEN_NAMES.VERIFICATION)
        );
      } else {
        // Direct to main app for workers
        navigation.dispatch(
          StackActions.replace(SCREEN_NAMES.FEED)
        );
      }
    } catch (error) {
      console.error('Role selection error:', error);
      Alert.alert(
        'Role Selection Failed',
        error.message || 'An error occurred while selecting your role. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  const handleBack = async () => {
    try {
      showLoading('Signing out...');
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      hideLoading();
    }
  };

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getRoleTitle = (role) => {
    switch (role) {
      case USER_ROLES.WORKER:
        return 'Party Worker';
      case USER_ROLES.COMMITTEE:
        return 'Committee Member';
      default:
        return '';
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case USER_ROLES.WORKER:
        return 'Basic party worker with standard access to post and interact with content';
      case USER_ROLES.COMMITTEE:
        return 'Verified committee member with elevated privileges and official posting capabilities';
      default:
        return '';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.WORKER:
        return 'people';
      case USER_ROLES.COMMITTEE:
        return 'how-to-vote';
      default:
        return '';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.WORKER:
        return COLORS.SUCCESS;
      case USER_ROLES.COMMITTEE:
        return COLORS.PRIMARY;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.profile_pic_url }}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Select Your Role</Text>
            <Text style={styles.subtitle}>
              Choose the role that best describes your position in the party
            </Text>
          </View>

          <View style={styles.rolesContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === USER_ROLES.WORKER && styles.selectedRoleCard,
                { borderColor: getRoleColor(USER_ROLES.WORKER) }
              ]}
              onPress={() => handleRoleSelect(USER_ROLES.WORKER)}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconContainer}>
                <Icon
                  name={getRoleIcon(USER_ROLES.WORKER)}
                  size={32}
                  color={getRoleColor(USER_ROLES.WORKER)}
                />
              </View>
              <Text style={styles.roleTitle}>
                {getRoleTitle(USER_ROLES.WORKER)}
              </Text>
              <Text style={styles.roleDescription}>
                {getRoleDescription(USER_ROLES.WORKER)}
              </Text>
              {selectedRole === USER_ROLES.WORKER && (
                <View style={styles.selectedIndicator}>
                  <Icon name="check-circle" size={24} color={COLORS.SUCCESS} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === USER_ROLES.COMMITTEE && styles.selectedRoleCard,
                { borderColor: getRoleColor(USER_ROLES.COMMITTEE) }
              ]}
              onPress={() => handleRoleSelect(USER_ROLES.COMMITTEE)}
              activeOpacity={0.8}
            >
              <View style={styles.roleIconContainer}>
                <Icon
                  name={getRoleIcon(USER_ROLES.COMMITTEE)}
                  size={32}
                  color={getRoleColor(USER_ROLES.COMMITTEE)}
                />
              </View>
              <Text style={styles.roleTitle}>
                {getRoleTitle(USER_ROLES.COMMITTEE)}
              </Text>
              <Text style={styles.roleDescription}>
                {getRoleDescription(USER_ROLES.COMMITTEE)}
              </Text>
              {selectedRole === USER_ROLES.COMMITTEE && (
                <View style={styles.selectedIndicator}>
                  <Icon name="check-circle" size={24} color={COLORS.SUCCESS} />
                </View>
              )}
              <View style={styles.verificationBadge}>
                <Text style={styles.verificationBadgeText}>
                  Verification Required
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedRole || isSubmitting) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={COLORS.BACKGROUND} />
            ) : (
              <Text style={styles.submitButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
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
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingTop: DIMENSIONS.PADDING.LG,
    paddingBottom: DIMENSIONS.PADDING.MD,
  },
  backButton: {
    padding: DIMENSIONS.PADDING.SM,
    marginRight: DIMENSIONS.PADDING.MD,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: DIMENSIONS.PADDING.MD,
  },
  userName: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  userEmail: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingBottom: DIMENSIONS.PADDING.XL,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  title: {
    fontSize: DIMENSIONS.FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  rolesContainer: {
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  roleCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderWidth: 2,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    padding: DIMENSIONS.PADDING.LG,
    marginBottom: DIMENSIONS.PADDING.MD,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedRoleCard: {
    backgroundColor: '#F8F9FA',
  },
  roleIconContainer: {
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  roleTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: DIMENSIONS.PADDING.MD,
    right: DIMENSIONS.PADDING.MD,
  },
  verificationBadge: {
    backgroundColor: COLORS.WARNING,
    paddingHorizontal: DIMENSIONS.PADDING.SM,
    paddingVertical: DIMENSIONS.PADDING.XS,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
    alignSelf: 'center',
    marginTop: DIMENSIONS.PADDING.MD,
  },
  verificationBadgeText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.BACKGROUND,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: COLORS.BORDER,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
});

export default RoleSelectionScreen;