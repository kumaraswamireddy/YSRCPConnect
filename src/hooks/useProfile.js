import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchUserProfile,
  updateProfile,
  updateProfileImage,
  followUser,
  unfollowUser,
  fetchUserPosts,
  enableOfficialTab,
  updateProfileState,
  updateFollowingStatus,
} from '../store/profileSlice';
import { profileService } from '../services/profile';
import { storageService } from '../services/storage';

export const useProfile = (userId = null) => {
  const dispatch = useDispatch();
  const {
    profile,
    posts,
    loading,
    error,
    isFollowing,
    followersCount,
    followingCount,
    postsCount,
    hasMorePosts,
    currentPostPage,
    officialTabEnabled,
  } = useSelector((state) => state.profile);

  const { user: currentUser } = useSelector((state) => state.auth);
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);

  // Fetch user profile
  const getUserProfile = useCallback(async (targetUserId = userId) => {
    try {
      // Check cache first
      const cacheKey = `profile_${targetUserId}`;
      const cachedProfile = await storageService.getProfileCache();
      
      if (cachedProfile && cachedProfile.id === targetUserId) {
        return cachedProfile;
      }

      const result = await dispatch(fetchUserProfile({ userId: targetUserId })).unwrap();
      
      // Cache the result
      await storageService.setProfileCache(result.user);
      
      return result.user;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }, [dispatch, userId]);

  // Update user profile
  const updateUserProfile = useCallback(async (profileData) => {
    try {
      const result = await dispatch(updateProfile({ profileData })).unwrap();
      
      // Update cache
      if (profile) {
        const updatedProfile = { ...profile, ...result.user };
        await storageService.setProfileCache(updatedProfile);
      }
      
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }, [dispatch, profile]);

  // Update profile image
  const updateProfileImageData = useCallback(async (imageUri) => {
    try {
      const result = await dispatch(updateProfileImage({ imageUri })).unwrap();
      
      // Update cache
      if (profile) {
        const updatedProfile = { ...profile, profile_pic_url: result.profileImage };
        await storageService.setProfileCache(updatedProfile);
      }
      
      return result;
    } catch (error) {
      console.error('Update profile image error:', error);
      throw error;
    }
  }, [dispatch, profile]);

  // Follow user
  const follow = useCallback(async (targetUserId = userId) => {
    try {
      const result = await dispatch(followUser({ userId: targetUserId })).unwrap();
      
      // Update following status locally
      dispatch(updateFollowingStatus(true));
      
      return result;
    } catch (error) {
      console.error('Follow user error:', error);
      throw error;
    }
  }, [dispatch, userId]);

  // Unfollow user
  const unfollow = useCallback(async (targetUserId = userId) => {
    try {
      const result = await dispatch(unfollowUser({ userId: targetUserId })).unwrap();
      
      // Update following status locally
      dispatch(updateFollowingStatus(false));
      
      return result;
    } catch (error) {
      console.error('Unfollow user error:', error);
      throw error;
    }
  }, [dispatch, userId]);

  // Toggle follow/unfollow
  const toggleFollow = useCallback(async () => {
    if (isFollowing) {
      return await unfollow();
    } else {
      return await follow();
    }
  }, [isFollowing, follow, unfollow]);

  // Fetch user posts
  const getUserPosts = useCallback(async (targetUserId = userId, page = 1, limit = 20) => {
    try {
      const result = await dispatch(fetchUserPosts({ userId: targetUserId, page, limit })).unwrap();
      return result;
    } catch (error) {
      console.error('Get user posts error:', error);
      throw error;
    }
  }, [dispatch, userId]);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (!hasMorePosts || loading) return;
    
    try {
      const nextPage = currentPostPage + 1;
      await dispatch(fetchUserPosts({ userId, page: nextPage })).unwrap();
    } catch (error) {
      console.error('Load more posts error:', error);
      throw error;
    }
  }, [dispatch, userId, hasMorePosts, loading, currentPostPage]);

  // Enable official tab
  const enableOfficialProfileTab = useCallback(async (officialData) => {
    try {
      const result = await dispatch(enableOfficialTab({ officialData })).unwrap();
      
      // Update profile state locally
      dispatch(updateProfileState({
        official_tab_enabled: true,
        official_title: officialData.official_title,
        constituency: officialData.constituency,
      }));
      
      return result;
    } catch (error) {
      console.error('Enable official tab error:', error);
      throw error;
    }
  }, [dispatch]);

  // Get user stats
  const getUserStats = useCallback(() => {
    return {
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
    };
  }, [followersCount, followingCount, postsCount]);

  // Check if user is verified
  const isVerified = useCallback(() => {
    return profile?.is_verified || false;
  }, [profile]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return profile?.role === 'admin';
  }, [profile]);

  // Check if user is committee member
  const isCommittee = useCallback(() => {
    return profile?.role === 'committee';
  }, [profile]);

  // Get user verification badge color
  const getVerificationBadgeColor = useCallback(() => {
    if (isAdmin()) return '#E1306C';
    if (isCommittee()) return '#1DA1F2';
    return null;
  }, [isAdmin, isCommittee]);

  // Get user verification badge text
  const getVerificationBadgeText = useCallback(() => {
    if (isAdmin()) return '✓ Admin';
    if (isCommittee()) return '✓ Verified';
    return null;
  }, [isAdmin, isCommittee]);

  // Initialize profile on component mount
  useEffect(() => {
    if (userId) {
      getUserProfile();
    }
  }, [userId, getUserProfile]);

  return {
    // State
    profile,
    posts,
    loading,
    error,
    isFollowing,
    followersCount,
    followingCount,
    postsCount,
    hasMorePosts,
    currentPostPage,
    officialTabEnabled,
    isOwnProfile,
    
    // Actions
    getUserProfile,
    updateUserProfile,
    updateProfileImageData,
    follow,
    unfollow,
    toggleFollow,
    getUserPosts,
    loadMorePosts,
    enableOfficialProfileTab,
    
    // Getters
    getUserStats,
    isVerified,
    isAdmin,
    isCommittee,
    getVerificationBadgeColor,
    getVerificationBadgeText,
  };
};