import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, DIMENSIONS, ERROR_MESSAGES } from '../../utils/constants';
import { useFeed } from '../../hooks/useFeed';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationContext';
import PostCard from '../../components/feed/PostCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const FeedScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);
  const {
    posts,
    loading,
    refreshing,
    error,
    hasMore,
    getFeed,
    refreshFeedData,
    loadMorePosts,
    likePostAction,
    unlikePostAction,
    sharePostAction,
    reportPostAction,
    isFeedStale,
  } = useFeed();
  const { canCreateOfficialPosts, canBroadcast } = useAuth();
  const { showAlert } = useNotifications();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const flatListRef = useRef(null);

  // Load feed on component mount
  useEffect(() => {
    loadInitialFeed();
  }, []);

  const loadInitialFeed = async () => {
    try {
      setIsInitialLoad(true);
      await getFeed(1, 20, true);
    } catch (error) {
      console.error('Error loading initial feed:', error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshFeedData();
    } catch (error) {
      console.error('Error refreshing feed:', error);
      showAlert('Error', 'Failed to refresh feed. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFeedData, showAlert]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      await loadMorePosts();
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  }, [hasMore, loading, loadMorePosts]);

  // Handle like post
  const handleLikePost = useCallback(async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      
      if (post.is_liked) {
        await unlikePostAction(postId);
      } else {
        await likePostAction(postId);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      showAlert('Error', 'Failed to update like status. Please try again.');
    }
  }, [posts, likePostAction, unlikePostAction, showAlert]);

  // Handle share post
  const handleSharePost = useCallback(async (postId) => {
    try {
      await sharePostAction(postId);
      showAlert('Success', 'Post shared successfully!');
    } catch (error) {
      console.error('Error sharing post:', error);
      showAlert('Error', 'Failed to share post. Please try again.');
    }
  }, [sharePostAction, showAlert]);

  // Handle report post
  const handleReportPost = useCallback(async (postId) => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Spam',
          onPress: async () => {
            try {
              await reportPostAction(postId, 'spam');
              showAlert('Success', 'Post reported successfully!');
            } catch (error) {
              console.error('Error reporting post:', error);
              showAlert('Error', 'Failed to report post. Please try again.');
            }
          },
        },
        {
          text: 'Inappropriate',
          onPress: async () => {
            try {
              await reportPostAction(postId, 'inappropriate');
              showAlert('Success', 'Post reported successfully!');
            } catch (error) {
              console.error('Error reporting post:', error);
              showAlert('Error', 'Failed to report post. Please try again.');
            }
          },
        },
        {
          text: 'Misinformation',
          onPress: async () => {
            try {
              await reportPostAction(postId, 'misinformation');
              showAlert('Success', 'Post reported successfully!');
            } catch (error) {
              console.error('Error reporting post:', error);
              showAlert('Error', 'Failed to report post. Please try again.');
            }
          },
        },
      ]
    );
  }, [reportPostAction, showAlert]);

  // Handle post press
  const handlePostPress = useCallback((postId) => {
    navigation.navigate('PostDetail', { postId });
  }, [navigation]);

  // Handle user press
  const handleUserPress = useCallback((userId) => {
    if (userId === user.id) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('Profile', { userId });
    }
  }, [navigation, user]);

  // Navigate to create post
  const navigateToCreatePost = useCallback(() => {
    navigation.navigate('CreatePost');
  }, [navigation]);

  // Render post item
  const renderPost = useCallback(({ item, index }) => (
    <PostCard
      post={item}
      onLike={() => handleLikePost(item.id)}
      onShare={() => handleSharePost(item.id)}
      onReport={() => handleReportPost(item.id)}
      onPress={() => handlePostPress(item.id)}
      onUserPress={() => handleUserPress(item.author.id)}
      style={index === 0 ? styles.firstPost : null}
    />
  ), [handleLikePost, handleSharePost, handleReportPost, handlePostPress, handleUserPress]);

  // Render footer
  const renderFooter = useCallback(() => {
    if (!hasMore) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>You've reached the end of your feed</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </View>
      );
    }

    return null;
  }, [hasMore, loading]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (isInitialLoad) {
      return null;
    }

    return (
      <EmptyState
        icon="feed"
        title="No Posts Yet"
        message="Start following people to see their posts in your feed"
        actionText="Find People"
        onAction={() => navigation.navigate('UserSearch')}
      />
    );
  }, [isInitialLoad, navigation]);

  // Key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Get list header component
  const ListHeader = useCallback(() => {
    if (canBroadcast) {
      return (
        <View style={styles.broadcastBanner}>
          <Icon name="campaign" size={24} color={COLORS.BACKGROUND} />
          <Text style={styles.broadcastText}>
            You can create broadcast posts to reach all party members
          </Text>
          <TouchableOpacity
            style={styles.broadcastButton}
            onPress={() => navigation.navigate('CreatePost', { isBroadcast: true })}
          >
            <Text style={styles.broadcastButtonText}>Create Broadcast</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (canCreateOfficialPosts) {
      return (
        <View style={styles.officialBanner}>
          <Icon name="verified" size={24} color={COLORS.BACKGROUND} />
          <Text style={styles.officialText}>
            You can create official posts as a verified committee member
          </Text>
          <TouchableOpacity
            style={styles.officialButton}
            onPress={() => navigation.navigate('CreatePost', { isOfficial: true })}
          >
            <Text style={styles.officialButtonText}>Create Official Post</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  }, [canBroadcast, canCreateOfficialPosts, navigation]);

  // Show error message
  if (error && !loading && posts.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          title="Error Loading Feed"
          message={error || ERROR_MESSAGES.NETWORK_ERROR}
          onRetry={loadInitialFeed}
        />
      </View>
    );
  }

  // Show loading spinner on initial load
  if (isInitialLoad) {
    return (
      <View style={styles.container}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {canCreateOfficialPosts || canBroadcast ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={navigateToCreatePost}
          activeOpacity={0.8}
        >
          <Icon name="add" size={24} color={COLORS.BACKGROUND} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContainer: {
    paddingBottom: DIMENSIONS.PADDING.LG,
  },
  firstPost: {
    marginTop: 0,
  },
  footerContainer: {
    paddingVertical: DIMENSIONS.PADDING.LG,
    alignItems: 'center',
  },
  footerText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  broadcastBanner: {
    backgroundColor: COLORS.ERROR,
    margin: DIMENSIONS.PADDING.MD,
    padding: DIMENSIONS.PADDING.MD,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  broadcastText: {
    flex: 1,
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.BACKGROUND,
    marginLeft: DIMENSIONS.PADDING.SM,
  },
  broadcastButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: DIMENSIONS.PADDING.SM,
    paddingVertical: DIMENSIONS.PADDING.XS,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
  },
  broadcastButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
  },
  officialBanner: {
    backgroundColor: COLORS.PRIMARY,
    margin: DIMENSIONS.PADDING.MD,
    padding: DIMENSIONS.PADDING.MD,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    flexDirection: 'row',
    alignItems: 'center',
  },
  officialText: {
    flex: 1,
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.BACKGROUND,
    marginLeft: DIMENSIONS.PADDING.SM,
  },
  officialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: DIMENSIONS.PADDING.SM,
    paddingVertical: DIMENSIONS.PADDING.XS,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
  },
  officialButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: DIMENSIONS.PADDING.XL,
    right: DIMENSIONS.PADDING.LG,
    backgroundColor: COLORS.PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FeedScreen;