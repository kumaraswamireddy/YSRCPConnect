import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ googleToken }, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(googleToken);
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const selectRole = createAsyncThunk(
  'auth/selectRole',
  async ({ role }, { rejectWithValue }) => {
    try {
      const response = await authService.selectRole(role);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Role selection failed');
    }
  }
);

export const requestVerification = createAsyncThunk(
  'auth/requestVerification',
  async ({ documents, notes }, { rejectWithValue }) => {
    try {
      const response = await authService.requestVerification(documents, notes);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification request failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      dispatch(clearUserData());
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  role: null,
  verificationStatus: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.role = user.role;
      state.verificationStatus = user.verification_status;
    },
    clearUserData: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.verificationStatus = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      AsyncStorage.setItem('userData', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.role = action.payload.user.role;
        state.verificationStatus = action.payload.user.verification_status;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Role selection
      .addCase(selectRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.role = action.payload.role;
        state.user.role = action.payload.role;
      })
      .addCase(selectRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verification request
      .addCase(requestVerification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestVerification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationStatus = 'pending';
        state.user.verification_status = 'pending';
      })
      .addCase(requestVerification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.role = null;
        state.verificationStatus = null;
      });
  },
});

export const { setUser, clearUserData, setLoading, clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;