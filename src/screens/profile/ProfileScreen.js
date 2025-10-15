import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TabView, SceneMap } from 'react-native-tab-view';
import { COLORS, DIMENSIONS, SCREEN_NAMES } from '../../utils/constants';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileActions from '../../components/profile/ProfileActions';
import UserPostsTab from '../../components/profile/UserPostsTab';
import UserAboutTab from '../../components/profile/UserAboutTab';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Tab = createMaterialTopTabNavigator();

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { showLoading, hideLoading } = useLoading();
  
  // Get userId from route params or use current user
  const userId = route.params?.userId || currentUser?.id;
  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);
  
  const {
    profile,
    posts,
    loading,
    error,
    isFollowing,
    followersCount,
    followingCount,
    postsCount,
    officialTabEnabled,
    getUserProfile,
    toggleFollow,
    getUserPosts,
    isVerified,
    isAdmin,
    isCommittee,
    getVerificationBadgeColor,
    getVerificationBadgeText,
  } = useProfile(userId);
  
  const { canCreateOfficialPosts } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'about', title: 'About' },
    ...(officialTabEnabled ? [{ key: 'official', title: 'Official' }] : []),
  ]);

  // Load profile data on component mount
  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const loadProfileData = async () => {
    try {
      await Promise.all([
        getUserProfile(userId),
        getUserPosts(userId),
      ]);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadProfileData();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  }, [getUserProfile, getUserPosts]);

  // Handle follow/unfollow
  const handleFollowToggle = useCallback(async () => {
    if (!isOwnProfile) {
      try {
        showLoading('Updating...');
        await toggleFollow();
      } catch (error) {
        console.error('Error toggling follow:', error);
        Alert.alert(
          'Error',
          'Failed to update follow status. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        hideLoading();
      }
    }
  }, [isOwnProfile, toggleFollow, showLoading, hideLoading]);

  // Handle message button press
  const handleMessagePress = useCallback(() => {
    if (!isOwnProfile) {
      navigation.navigate('Chat', { userId });
    }
  }, [isOwnProfile, navigation, userId]);

  // Handle edit profile button press
  const handleEditProfilePress = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.EDIT_PROFILE);
  }, [navigation]);

  // Handle settings button press
  const handleSettingsPress = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.SETTINGS);
  }, [navigation]);

  // Handle post press
  const handlePostPress = useCallback((postId) => {
    navigation.navigate('PostDetail', { postId });
  }, [navigation]);

  // Handle followers press
  const handleFollowersPress = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.FOLLOWERS, { userId });
  }, [navigation, userId]);

  // Handle following press
  const handleFollowingPress = useCallback(() => {
    navigation.navigate(SCREEN_NAMES.FOLLOWING, { userId });
  }, [navigation, userId]);

  // Create tab screens
  const renderScene = SceneMap({
    posts: () => (
      <UserPostsTab
        posts={posts}
        onPostPress={handlePostPress}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        loading={loading}
      />
    ),
    about: () => (
      <UserAboutTab
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEditProfile={handleEditProfilePress}
      />
    ),
    ...(officialTabEnabled ? {
      official: () => (
        <UserPostsTab
          posts={posts.filter(post => post.is_official)}
          onPostPress={handlePostPress}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          loading={loading}
          isOfficialTab
        />
      )
    } : {}),
  });

  // Show error message
  if (error && !loading && !profile) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          title="Error Loading Profile"
          message={error}
          onRetry={loadProfileData}
        />
      </View>
    );
  }

  // Show loading spinner
  if (loading && !profile) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
      >
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEditProfile={handleEditProfilePress}
          onSettingsPress={handleSettingsPress}
        />

        {/* Profile Stats */}
        <ProfileStats
          postsCount={postsCount}
          followersCount={followersCount}
          followingCount={followingCount}
          onFollowersPress={handleFollowersPress}
          onFollowingPress={handleFollowingPress}
        />

        {/* Profile Actions */}
        <ProfileActions
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          canCreateOfficialPosts={canCreateOfficialPosts && isOwnProfile}
          onFollowPress={handleFollowToggle}
          onMessagePress={handleMessagePress}
          onEditProfilePress={handleEditProfilePress}
          onCreateOfficialPost={() => navigation.navigate('CreatePost', { isOfficial: true })}
        />
      </ScrollView>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: DIMENSIONS.SCREEN_WIDTH }}
          renderTabBar={(props) => (
            <View style={styles.tabBar}>
              {props.navigationState.routes.map((route, i) => (
                <TouchableOpacity
                  key={route.key}
                  style={[
                    styles.tab,
                    i === props.navigationState.index && styles.activeTab,
                  ]}
                  onPress={() => props.setIndex(i)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      i === props.navigationState.index && styles.activeTabText,
                    ]}
                  >
                    {route.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          style={styles.tabView}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: DIMENSIONS.PADDING.LG,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  tab: {
    flex: 1,
    paddingVertical: DIMENSIONS.PADDING.MD,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;