import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  loginUser,
  selectRole,
  requestVerification,
  logoutUser,
  updateUserProfile,
} from '../store/authSlice';
import { authService } from '../services/auth';
import { storageService } from '../services/storage';

export const useAuth = () => {
  const dispatch = useDispatch();
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    role,
    verificationStatus,
  } = useSelector((state) => state.auth);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    try {
      // Initiate Google OAuth
      const googleToken = await authService.initiateGoogleAuth();
      
      if (!googleToken) {
        throw new Error('Google authentication failed');
      }

      // Login with Google token
      await dispatch(loginUser({ googleToken })).unwrap();
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [dispatch]);

  // Select user role
  const selectUserRole = useCallback(async (selectedRole) => {
    try {
      await dispatch(selectRole({ role: selectedRole })).unwrap();
      return true;
    } catch (error) {
      console.error('Role selection error:', error);
      throw error;
    }
  }, [dispatch]);

  // Request verification
  const requestUserVerification = useCallback(async (documents, notes) => {
    try {
      await dispatch(requestVerification({ documents, notes })).unwrap();
      return true;
    } catch (error) {
      console.error('Verification request error:', error);
      throw error;
    }
  }, [dispatch]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [dispatch]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      await dispatch(updateUserProfile(profileData)).unwrap();
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [dispatch]);

  // Check if user is verified
  const isVerified = useCallback(() => {
    return verificationStatus === 'approved';
  }, [verificationStatus]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return role === 'admin';
  }, [role]);

  // Check if user is committee member
  const isCommittee = useCallback(() => {
    return role === 'committee';
  }, [role]);

  // Check if user is worker
  const isWorker = useCallback(() => {
    return role === 'worker';
  }, [role]);

  // Check if user can create official posts
  const canCreateOfficialPosts = useCallback(() => {
    return isVerified() && (isCommittee() || isAdmin());
  }, [isVerified, isCommittee, isAdmin]);

  // Check if user can broadcast
  const canBroadcast = useCallback(() => {
    return isAdmin();
  }, [isAdmin]);

  // Check if verification is pending
  const isVerificationPending = useCallback(() => {
    return verificationStatus === 'pending';
  }, [verificationStatus]);

  // Check if verification is rejected
  const isVerificationRejected = useCallback(() => {
    return verificationStatus === 'rejected';
  }, [verificationStatus]);

  // Get user display name
  const getDisplayName = useCallback(() => {
    return user?.name || 'Unknown User';
  }, [user]);

  // Get user profile picture
  const getProfilePicture = useCallback(() => {
    return user?.profile_pic_url || null;
  }, [user]);

  // Get user position/committee
  const getPositionInfo = useCallback(() => {
    return {
      position: user?.position || '',
      committee: user?.committee_name || '',
    };
  }, [user]);

  // Refresh auth state
  const refreshAuthState = useCallback(async () => {
    try {
      const authData = await authService.getAuthData();
      if (authData) {
        dispatch(loginUser(authData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Refresh auth state error:', error);
      return false;
    }
  }, [dispatch]);

  return {
    // State
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    role,
    verificationStatus,
    
    // Actions
    loginWithGoogle,
    selectUserRole,
    requestUserVerification,
    logout,
    updateProfile,
    refreshAuthState,
    
    // Getters
    isVerified,
    isAdmin,
    isCommittee,
    isWorker,
    canCreateOfficialPosts,
    canBroadcast,
    isVerificationPending,
    isVerificationRejected,
    getDisplayName,
    getProfilePicture,
    getPositionInfo,
  };
};