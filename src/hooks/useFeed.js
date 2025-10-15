import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchFeed,
  refreshFeed,
  likePost,
  unlikePost,
  sharePost,
  reportPost,
  clearFeed,
  addNewPost,
  updatePost,
  removePost,
} from '../store/feedSlice';
import { feedService } from '../services/feed';
import { storageService } from '../services/storage';

export const useFeed = () => {
  const dispatch = useDispatch();
  const {
    posts,
    loading,
    refreshing,
    error,
    hasMore,
    currentPage,
    lastFetchTime,
  } = useSelector((state) => state.feed);

  // Fetch feed posts
  const getFeed = useCallback(async (page = 1, limit = 20, refresh = false) => {
    try {
      // Check cache first if not refreshing
      if (!refresh && page === 1) {
        const cachedFeed = await storageService.getFeedCache();
        if (cachedFeed) {
          return cachedFeed;
        }
      }

      const result = await dispatch(fetchFeed({ page, limit, refresh })).unwrap();
      
      // Cache the result
      if (page === 1) {
        await storageService.setFeedCache(result);
      }
      
      return result;
    } catch (error) {
      console.error('Get feed error:', error);
      throw error;
    }
  }, [dispatch]);

  // Refresh feed
  const refreshFeedData = useCallback(async () => {
    try {
      const result = await dispatch(refreshFeed()).unwrap();
      
      // Update cache
      await storageService.setFeedCache(result);
      
      return result;
    } catch (error) {
      console.error('Refresh feed error:', error);
      throw error;
    }
  }, [dispatch]);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      const nextPage = currentPage + 1;
      await dispatch(fetchFeed({ page: nextPage })).unwrap();
    } catch (error) {
      console.error('Load more posts error:', error);
      throw error;
    }
  }, [dispatch, hasMore, loading, currentPage]);

  // Like a post
  const likePostAction = useCallback(async (postId) => {
    try {
      const result = await dispatch(likePost({ postId })).unwrap();
      
      // Update post in local state
      dispatch(updatePost({
        postId,
        updates: {
          is_liked: true,
          like_count: result.likeCount,
        },
      }));
      
      return result;
    } catch (error) {
      console.error('Like post error:', error);
      throw error;
    }
  }, [dispatch]);

  // Unlike a post
  const unlikePostAction = useCallback(async (postId) => {
    try {
      const result = await dispatch(unlikePost({ postId })).unwrap();
      
      // Update post in local state
      dispatch(updatePost({
        postId,
        updates: {
          is_liked: false,
          like_count: result.likeCount,
        },
      }));
      
      return result;
    } catch (error) {
      console.error('Unlike post error:', error);
      throw error;
    }
  }, [dispatch]);

  // Share a post
  const sharePostAction = useCallback(async (postId) => {
    try {
      const result = await dispatch(sharePost({ postId })).unwrap();
      
      // Update post in local state
      dispatch(updatePost({
        postId,
        updates: {
          share_count: result.shareCount,
        },
      }));
      
      return result;
    } catch (error) {
      console.error('Share post error:', error);
      throw error;
    }
  }, [dispatch]);

  // Report a post
  const reportPostAction = useCallback(async (postId, reason, description) => {
    try {
      const result = await dispatch(reportPost({ postId, reason, description })).unwrap();
      return result;
    } catch (error) {
      console.error('Report post error:', error);
      throw error;
    }
  }, [dispatch]);

  // Add a new post to the feed
  const addPost = useCallback(async (postData) => {
    try {
      // Create post via API
      const newPost = await feedService.createPost(postData);
      
      // Add to local state
      dispatch(addNewPost(newPost));
      
      // Clear cache to ensure fresh data
      await storageService.removeItem(storageService.keys.FEED_CACHE);
      
      return newPost;
    } catch (error) {
      console.error('Add post error:', error);
      throw error;
    }
  }, [dispatch]);

  // Delete a post
  const deletePost = useCallback(async (postId) => {
    try {
      await feedService.deletePost(postId);
      
      // Remove from local state
      dispatch(removePost(postId));
      
      // Clear cache to ensure fresh data
      await storageService.removeItem(storageService.keys.FEED_CACHE);
      
      return true;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear feed
  const clearFeedData = useCallback(() => {
    dispatch(clearFeed());
    storageService.removeItem(storageService.keys.FEED_CACHE);
  }, [dispatch]);

  // Get post by ID
  const getPostById = useCallback((postId) => {
    return posts.find(post => post.id === postId);
  }, [posts]);

  // Check if feed is stale (older than 5 minutes)
  const isFeedStale = useCallback(() => {
    if (!lastFetchTime) return true;
    
    const staleTime = 5 * 60 * 1000; // 5 minutes
    return Date.now() - new Date(lastFetchTime).getTime() > staleTime;
  }, [lastFetchTime]);

  // Get posts by type
  const getPostsByType = useCallback((type) => {
    return posts.filter(post => post.content_type === type);
  }, [posts]);

  // Get official posts
  const getOfficialPosts = useCallback(() => {
    return posts.filter(post => post.is_official);
  }, [posts]);

  // Get broadcast posts
  const getBroadcastPosts = useCallback(() => {
    return posts.filter(post => post.is_broadcast);
  }, [posts]);

  // Get posts from verified users
  const getVerifiedUserPosts = useCallback(() => {
    return posts.filter(post => post.author.is_verified);
  }, [posts]);

  // Get posts from followed users
  const getFollowedUserPosts = useCallback(() => {
    return posts.filter(post => post.author.is_following);
  }, [posts]);

  // Initialize feed on component mount
  useEffect(() => {
    if (posts.length === 0 && !loading) {
      getFeed();
    }
  }, [posts.length, loading, getFeed]);

  return {
    // State
    posts,
    loading,
    refreshing,
    error,
    hasMore,
    currentPage,
    lastFetchTime,
    
    // Actions
    getFeed,
    refreshFeedData,
    loadMorePosts,
    likePostAction,
    unlikePostAction,
    sharePostAction,
    reportPostAction,
    addPost,
    deletePost,
    clearFeedData,
    
    // Getters
    getPostById,
    isFeedStale,
    getPostsByType,
    getOfficialPosts,
    getBroadcastPosts,
    getVerifiedUserPosts,
    getFollowedUserPosts,
  };
};