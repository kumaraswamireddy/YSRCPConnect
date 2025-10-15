import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../services/profile';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ profileData }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async ({ imageUri }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfileImage(imageUri);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile image');
    }
  }
);

export const followUser = createAsyncThunk(
  'profile/followUser',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await profileService.followUser(userId);
      return { userId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'profile/unfollowUser',
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await profileService.unfollowUser(userId);
      return { userId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'profile/fetchUserPosts',
  async ({ userId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserPosts(userId, page, limit);
      return { ...response, userId, page };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user posts');
    }
  }
);

export const enableOfficialTab = createAsyncThunk(
  'profile/enableOfficialTab',
  async ({ officialData }, { rejectWithValue }) => {
    try {
      const response = await profileService.enableOfficialTab(officialData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enable official tab');
    }
  }
);

const initialState = {
  profile: null,
  posts: [],
  loading: false,
  error: null,
  isFollowing: false,
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
  hasMorePosts: true,
  currentPostPage: 1,
  officialTabEnabled: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.posts = [];
      state.isFollowing = false;
      state.followersCount = 0;
      state.followingCount = 0;
      state.postsCount = 0;
      state.hasMorePosts = true;
      state.currentPostPage = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfileState: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updateFollowingStatus: (state, action) => {
      state.isFollowing = action.payload;
      state.followersCount = action.payload 
        ? state.followersCount + 1 
        : state.followersCount - 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.isFollowing = action.payload.isFollowing;
        state.followersCount = action.payload.user.follower_count;
        state.followingCount = action.payload.user.following_count;
        state.postsCount = action.payload.user.post_count;
        state.officialTabEnabled = action.payload.user.official_tab_enabled;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload.user };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile image
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile.profile_pic_url = action.payload.profileImage;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        state.isFollowing = true;
        state.followersCount = action.payload.followersCount;
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isFollowing = false;
        state.followersCount = action.payload.followersCount;
      })
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        const { posts, page } = action.payload;
        
        if (page === 1) {
          state.posts = posts;
        } else {
          state.posts = [...state.posts, ...posts];
        }
        
        state.loading = false;
        state.currentPostPage = page;
        state.hasMorePosts = posts.length === 20;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Enable official tab
      .addCase(enableOfficialTab.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableOfficialTab.fulfilled, (state, action) => {
        state.loading = false;
        state.officialTabEnabled = true;
        state.profile.official_title = action.payload.officialTitle;
        state.profile.constituency = action.payload.constituency;
      })
      .addCase(enableOfficialTab.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearProfile, 
  clearError, 
  updateProfileState, 
  updateFollowingStatus 
} = profileSlice.actions;

export default profileSlice.reducer;