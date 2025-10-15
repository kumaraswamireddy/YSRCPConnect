import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedService } from '../services/feed';

// Async thunks
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async ({ page = 1, limit = 20, refresh = false }, { rejectWithValue }) => {
    try {
      const response = await feedService.getFeed(page, limit);
      return { ...response, page, refresh };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feed');
    }
  }
);

export const refreshFeed = createAsyncThunk(
  'feed/refreshFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await feedService.refreshFeed();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh feed');
    }
  }
);

export const likePost = createAsyncThunk(
  'feed/likePost',
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await feedService.likePost(postId);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'feed/unlikePost',
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await feedService.unlikePost(postId);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

export const sharePost = createAsyncThunk(
  'feed/sharePost',
  async ({ postId }, { rejectWithValue }) => {
    try {
      const response = await feedService.sharePost(postId);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to share post');
    }
  }
);

export const reportPost = createAsyncThunk(
  'feed/reportPost',
  async ({ postId, reason, description }, { rejectWithValue }) => {
    try {
      const response = await feedService.reportPost(postId, reason, description);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to report post');
    }
  }
);

const initialState = {
  posts: [],
  loading: false,
  refreshing: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  lastFetchTime: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearFeed: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    addNewPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const { postId, updates } = action.payload;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
    removePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter(post => post.id !== postId);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed
      .addCase(fetchFeed.pending, (state, action) => {
        const { refresh } = action.meta.arg;
        if (refresh) {
          state.refreshing = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { posts, refresh, page } = action.payload;
        
        if (refresh || page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        
        state.loading = false;
        state.refreshing = false;
        state.currentPage = page;
        state.hasMore = posts.length === 20;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload;
      })
      // Refresh feed
      .addCase(refreshFeed.pending, (state) => {
        state.refreshing = true;
        state.error = null;
      })
      .addCase(refreshFeed.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
        state.refreshing = false;
        state.currentPage = 1;
        state.hasMore = action.payload.posts.length === 20;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(refreshFeed.rejected, (state, action) => {
        state.refreshing = false;
        state.error = action.payload;
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].is_liked = liked;
          state.posts[postIndex].like_count = likeCount;
        }
      })
      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, liked, likeCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].is_liked = liked;
          state.posts[postIndex].like_count = likeCount;
        }
      })
      // Share post
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId, shareCount } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].share_count = shareCount;
        }
      });
  },
});

export const { clearFeed, addNewPost, updatePost, removePost, clearError } = feedSlice.actions;
export default feedSlice.reducer;